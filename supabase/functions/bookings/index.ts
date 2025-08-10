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

    const { action, bookingData, bookingId, status } = await req.json()

    switch (action) {
      case 'create_booking':
        // Calculate fare based on distance and type
        let baseFare = 15
        if (bookingData.bookingType === 'private') baseFare *= 3
        if (bookingData.scheduledTime !== 'now') baseFare += 5

        const bookingId = crypto.randomUUID()
        const { data: booking, error: bookingError } = await supabaseClient
          .from('bookings')
          .insert({
            id: bookingId,
            commuter_id: user.id,
            pickup_location: bookingData.from,
            destination_location: bookingData.to,
            passenger_count: bookingData.passengers,
            booking_type: bookingData.bookingType,
            scheduled_time: bookingData.scheduledTime === 'later' 
              ? new Date(`${bookingData.departureDate}T${bookingData.departureTime}`).toISOString()
              : null,
            fare_amount: baseFare,
            payment_method: bookingData.paymentMethod,
            status: 'pending'
          })
          .select()
          .single()

        if (bookingError) {
          return new Response(JSON.stringify({ error: bookingError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        // Create notification for nearby drivers
        await supabaseClient
          .from('notifications')
          .insert({
            user_id: user.id,
            title: 'New Booking Request',
            message: `Trip from ${bookingData.from} to ${bookingData.to}`,
            notification_type: 'trip_update'
          })

        return new Response(JSON.stringify({ booking }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'accept_booking':
        const { error: acceptError } = await supabaseClient
          .from('bookings')
          .update({ 
            driver_id: user.id,
            status: 'accepted',
            updated_at: new Date().toISOString()
          })
          .eq('id', bookingId)

        if (acceptError) {
          return new Response(JSON.stringify({ error: acceptError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        return new Response(JSON.stringify({ message: 'Booking accepted' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'update_trip_status':
        const updateData: any = { 
          status,
          updated_at: new Date().toISOString()
        }

        if (status === 'picked_up') {
          updateData.pickup_time = new Date().toISOString()
        } else if (status === 'completed') {
          updateData.completion_time = new Date().toISOString()
        }

        const { error: updateError } = await supabaseClient
          .from('bookings')
          .update(updateData)
          .eq('id', bookingId)

        if (updateError) {
          return new Response(JSON.stringify({ error: updateError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        return new Response(JSON.stringify({ message: 'Trip status updated' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'get_bookings':
        const { data: bookings, error: getError } = await supabaseClient
          .from('bookings')
          .select(`
            *,
            driver:users!bookings_driver_id_fkey(full_name, phone),
            commuter:users!bookings_commuter_id_fkey(full_name, phone)
          `)
          .or(`commuter_id.eq.${user.id},driver_id.eq.${user.id}`)
          .order('created_at', { ascending: false })

        if (getError) {
          return new Response(JSON.stringify({ error: getError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        return new Response(JSON.stringify({ bookings }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'get_driver_requests':
        const { data: requests, error: requestError } = await supabaseClient
          .from('bookings')
          .select(`
            *,
            commuter:users!bookings_commuter_id_fkey(full_name, phone, rating)
          `)
          .eq('status', 'pending')
          .is('driver_id', null)
          .order('created_at', { ascending: false })

        if (requestError) {
          return new Response(JSON.stringify({ error: requestError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        return new Response(JSON.stringify({ requests }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'cancel_booking':
        const { error: cancelError } = await supabaseClient
          .from('bookings')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('id', bookingId)

        if (cancelError) {
          return new Response(JSON.stringify({ error: cancelError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        return new Response(JSON.stringify({ message: 'Booking cancelled' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

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