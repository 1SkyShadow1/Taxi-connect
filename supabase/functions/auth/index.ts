import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { action, email, password, phone, userType, userData } = await req.json()

    const signupSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      phone: z.string().min(8),
      userType: z.enum(['driver','commuter']),
      userData: z.object({
        fullName: z.string().min(2),
        idNumber: z.string().min(5),
        address: z.string().min(5),
        dateOfBirth: z.string(),
        gender: z.string().optional(),
        vehicleInfo: z.object({
          licenseNumber: z.string().optional(),
          make: z.string().optional(),
          model: z.string().optional(),
          year: z.string().optional(),
          licensePlate: z.string().optional(),
          capacity: z.number().optional()
        }).optional()
      })
    })

    switch (action) {
      case 'signup':
        const validation = signupSchema.safeParse({ email, password, phone, userType, userData })
        if (!validation.success) {
          return new Response(JSON.stringify({ errors: validation.error.flatten() }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 422
          })
        }

        const { data: authUser, error: signUpError } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: userData.fullName,
              phone: phone,
              user_type: userType
            }
          }
        })

        if (signUpError) {
          return new Response(JSON.stringify({ error: signUpError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        // Create user profile
        if (authUser.user) {
          const { error: profileError } = await supabaseClient
            .from('users')
            .insert({
              id: authUser.user.id,
              email,
              phone,
              full_name: userData.fullName,
              user_type: userType,
              id_number: userData.idNumber,
              address: userData.address,
              date_of_birth: userData.dateOfBirth,
              gender: userData.gender
            })

          if (profileError) {
            console.error('Profile creation error:', profileError)
          }

          // Create wallet for user
          await supabaseClient
            .from('wallets')
            .insert({
              user_id: authUser.user.id,
              balance: 0.00
            })

          // Create notification settings
          await supabaseClient
            .from('notification_settings')
            .insert({
              user_id: authUser.user.id
            })

          // If driver, create driver profile
          if (userType === 'driver' && userData.vehicleInfo) {
            await supabaseClient
              .from('drivers')
              .insert({
                user_id: authUser.user.id,
                license_number: userData.vehicleInfo.licenseNumber,
                vehicle_make: userData.vehicleInfo.make,
                vehicle_model: userData.vehicleInfo.model,
                vehicle_year: userData.vehicleInfo.year,
                license_plate: userData.vehicleInfo.licensePlate,
                vehicle_capacity: userData.vehicleInfo.capacity || 16
              })
          }
        }

        return new Response(JSON.stringify({ user: authUser.user, session: authUser.session }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'signin':
        const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        })

        if (signInError) {
          return new Response(JSON.stringify({ error: signInError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        return new Response(JSON.stringify({ user: signInData.user, session: signInData.session }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'signout':
        const { error: signOutError } = await supabaseClient.auth.signOut()
        
        if (signOutError) {
          return new Response(JSON.stringify({ error: signOutError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        return new Response(JSON.stringify({ message: 'Signed out successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'reset_password':
        const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(email)
        
        if (resetError) {
          return new Response(JSON.stringify({ error: resetError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        return new Response(JSON.stringify({ message: 'Password reset email sent' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})