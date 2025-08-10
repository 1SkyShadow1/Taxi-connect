import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401
      })
    }

    const { action, amount, paymentMethod, cardToken, phoneNumber, tripId, fareAmount, withdrawalAmount, bankDetails, recipient, note } = await req.json()

    switch (action) {
      case 'top_up_wallet':
        const { data: wallet } = await supabaseClient
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (!wallet) {
          return new Response(JSON.stringify({ error: 'Wallet not found' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404
          })
        }

        // Process payment based on method
        let paymentProcessed = false
        let paymentReference = `TOP${Date.now()}`

        // Simulate payment processing
        if (paymentMethod === 'card') {
          // Integrate with Stripe or PayFast
          paymentProcessed = true
        } else if (paymentMethod === 'bank') {
          // Bank transfer processing
          paymentProcessed = true
        } else if (paymentMethod === 'mobile') {
          // Mobile money processing
          paymentProcessed = true
        }

        if (paymentProcessed) {
          // Update wallet balance
          const newBalance = parseFloat(wallet.balance) + parseFloat(amount)
          const { error: updateError } = await supabaseClient
            .from('wallets')
            .update({ 
              balance: newBalance,
              total_topups: parseFloat(wallet.total_topups) + parseFloat(amount),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)

          if (updateError) {
            return new Response(JSON.stringify({ error: updateError.message }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400
            })
          }

          // Record transaction
          await supabaseClient
            .from('transactions')
            .insert({
              user_id: user.id,
              wallet_id: wallet.id,
              transaction_type: 'topup',
              amount: parseFloat(amount),
              description: `Wallet top-up via ${paymentMethod}`,
              payment_method: paymentMethod,
              reference_number: paymentReference,
              status: 'completed'
            })

          return new Response(JSON.stringify({ 
            message: 'Top-up successful',
            new_balance: newBalance,
            reference: paymentReference
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        return new Response(JSON.stringify({ error: 'Payment processing failed' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        })

      case 'get_wallet_balance':
        const { data: walletData } = await supabaseClient
          .from('wallets')
          .select('balance, total_topups, total_spent')
          .eq('user_id', user.id)
          .single()

        return new Response(JSON.stringify({ wallet: walletData }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'get_transactions':
        const { data: transactions } = await supabaseClient
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)

        return new Response(JSON.stringify({ transactions }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'process_trip_payment':
        const { data: currentWallet } = await supabaseClient
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (parseFloat(currentWallet.balance) < parseFloat(fareAmount)) {
          return new Response(JSON.stringify({ error: 'Insufficient funds' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        // Deduct fare from wallet
        const newWalletBalance = parseFloat(currentWallet.balance) - parseFloat(fareAmount)
        await supabaseClient
          .from('wallets')
          .update({ 
            balance: newWalletBalance,
            total_spent: parseFloat(currentWallet.total_spent) + parseFloat(fareAmount),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)

        // Record payment transaction
        await supabaseClient
          .from('transactions')
          .insert({
            user_id: user.id,
            wallet_id: currentWallet.id,
            booking_id: tripId,
            transaction_type: 'payment',
            amount: -parseFloat(fareAmount),
            description: 'Trip payment',
            payment_method: 'wallet',
            reference_number: `PAY${Date.now()}`,
            status: 'completed'
          })

        return new Response(JSON.stringify({ 
          message: 'Payment successful',
          new_balance: newWalletBalance
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'driver_withdrawal':
        // Find driver record and update earnings
        const { data: driverData } = await supabaseClient
          .from('drivers')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (!driverData) {
          return new Response(JSON.stringify({ error: 'Driver profile not found' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404
          })
        }

        if (parseFloat(driverData.total_earnings) < parseFloat(withdrawalAmount)) {
          return new Response(JSON.stringify({ error: 'Insufficient earnings' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        // Process withdrawal (integrate with banking API)
        const withdrawalReference = `WIT${Date.now()}`
        
        // Update driver earnings
        await supabaseClient
          .from('drivers')
          .update({ 
            total_earnings: parseFloat(driverData.total_earnings) - parseFloat(withdrawalAmount),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)

        // Record withdrawal transaction
        await supabaseClient
          .from('transactions')
          .insert({
            user_id: user.id,
            transaction_type: 'withdrawal',
            amount: -parseFloat(withdrawalAmount),
            description: 'Driver earnings withdrawal',
            reference_number: withdrawalReference,
            status: 'completed'
          })

        return new Response(JSON.stringify({ 
          message: 'Withdrawal processed',
          reference: withdrawalReference
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'wallet_transfer': {
        const transferAmount = parseFloat(amount)
        if (isNaN(transferAmount) || transferAmount <= 0) {
          return new Response(JSON.stringify({ error: 'Invalid amount' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
        }
        // Get sender wallet
        const { data: senderWallet, error: senderWalletError } = await supabaseClient
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .single()
        if (senderWalletError || !senderWallet) {
          return new Response(JSON.stringify({ error: 'Sender wallet not found' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 })
        }
        if (parseFloat(senderWallet.balance) < transferAmount) {
          return new Response(JSON.stringify({ error: 'Insufficient balance' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
        }
        // Find recipient user by email or phone
        let recipientQuery = supabaseClient.from('users').select('id, full_name, email').limit(1)
        if (recipient && typeof recipient === 'string') {
          if (recipient.includes('@')) recipientQuery = recipientQuery.eq('email', recipient)
          else recipientQuery = recipientQuery.eq('phone', recipient)
        }
        const { data: recipientUsers, error: recipientError } = await recipientQuery
        if (recipientError || !recipientUsers || recipientUsers.length === 0) {
          return new Response(JSON.stringify({ error: 'Recipient not found' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 })
        }
        const recipientUser = recipientUsers[0]
        if (recipientUser.id === user.id) {
          return new Response(JSON.stringify({ error: 'Cannot transfer to self' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
        }
        // Get / create recipient wallet
        let { data: recipientWallet } = await supabaseClient
          .from('wallets')
          .select('*')
          .eq('user_id', recipientUser.id)
          .single()
        if (!recipientWallet) {
          const { data: createdWallet, error: createWalletError } = await supabaseClient
            .from('wallets')
            .insert({ user_id: recipientUser.id, balance: 0, total_topups: 0, total_spent: 0 })
            .select('*')
            .single()
          if (createWalletError) {
            return new Response(JSON.stringify({ error: 'Failed to init recipient wallet' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
          }
          recipientWallet = createdWallet
        }
        const reference = `TRF${Date.now()}`
        const newSenderBalance = parseFloat(senderWallet.balance) - transferAmount
        const newRecipientBalance = parseFloat(recipientWallet.balance) + transferAmount
        // Update balances
        const { error: senderUpdateError } = await supabaseClient
          .from('wallets')
          .update({ balance: newSenderBalance, total_spent: parseFloat(senderWallet.total_spent) + transferAmount, updated_at: new Date().toISOString() })
          .eq('id', senderWallet.id)
        if (senderUpdateError) {
          return new Response(JSON.stringify({ error: senderUpdateError.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
        }
        const { error: recipientUpdateError } = await supabaseClient
          .from('wallets')
          .update({ balance: newRecipientBalance, total_topups: parseFloat(recipientWallet.total_topups) + transferAmount, updated_at: new Date().toISOString() })
          .eq('id', recipientWallet.id)
        if (recipientUpdateError) {
          return new Response(JSON.stringify({ error: recipientUpdateError.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
        }
        // Insert transactions
        await supabaseClient.from('transactions').insert([
          {
            user_id: user.id,
            wallet_id: senderWallet.id,
            transaction_type: 'transfer_out',
            amount: -transferAmount,
            description: `Transfer to ${recipientUser.full_name || recipientUser.email}`,
            payment_method: 'wallet',
            reference_number: reference,
            status: 'completed',
            metadata: note ? { note } : null
          },
          {
            user_id: recipientUser.id,
            wallet_id: recipientWallet.id,
            transaction_type: 'transfer_in',
            amount: transferAmount,
            description: `Transfer from ${user.email}`,
            payment_method: 'wallet',
            reference_number: reference,
            status: 'completed',
            metadata: note ? { note } : null
          }
        ])
        return new Response(JSON.stringify({ message: 'Transfer successful', reference, balance: newSenderBalance }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})