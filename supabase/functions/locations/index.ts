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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { action, pickup_lat, pickup_lng, radius, location, from, to } = await req.json()

    switch (action) {
      case 'get_popular_routes':
        // Insert some sample popular routes if none exist
        const { count } = await supabaseClient
          .from('popular_routes')
          .select('*', { count: 'exact', head: true })

        if (count === 0) {
          await supabaseClient
            .from('popular_routes')
            .insert([
              {
                from_location: 'Park Station',
                to_location: 'Maponya Mall',
                estimated_fare: 13.00,
                estimated_duration: 45,
                trip_count: 125
              },
              {
                from_location: 'Sandton City',
                to_location: 'Alexandra Mall',
                estimated_fare: 11.00,
                estimated_duration: 30,
                trip_count: 89
              },
              {
                from_location: 'OR Tambo Airport',
                to_location: 'Sandton',
                estimated_fare: 85.00,
                estimated_duration: 60,
                trip_count: 210
              },
              {
                from_location: 'Rosebank Mall',
                to_location: 'Melville',
                estimated_fare: 22.00,
                estimated_duration: 35,
                trip_count: 67
              }
            ])
        }

        const { data: routes, error: routesError } = await supabaseClient
          .from('popular_routes')
          .select('*')
          .order('trip_count', { ascending: false })
          .limit(10)

        if (routesError) {
          return new Response(JSON.stringify({ error: routesError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        return new Response(JSON.stringify({ routes }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'get_taxi_ranks':
        // Return popular taxi rank locations in South Africa
        const taxiRanks = [
          {
            id: 1,
            name: 'Park Station Taxi Rank',
            location: 'Park Station, Johannesburg',
            coordinates: { lat: -26.2041, lng: 28.0473 },
            routes: ['Soweto', 'Alexandra', 'Randburg', 'Sandton'],
            operating_hours: '24/7'
          },
          {
            id: 2,
            name: 'Bree Street Taxi Rank',
            location: 'Bree Street, Johannesburg CBD',
            coordinates: { lat: -26.2023, lng: 28.0436 },
            routes: ['Pretoria', 'Kempton Park', 'Springs', 'Boksburg'],
            operating_hours: '05:00 - 22:00'
          },
          {
            id: 3,
            name: 'Wanderers Street Taxi Rank',
            location: 'Wanderers Street, Johannesburg',
            coordinates: { lat: -26.1951, lng: 28.0516 },
            routes: ['Hillbrow', 'Yeoville', 'Observatory', 'Bellevue'],
            operating_hours: '24/7'
          },
          {
            id: 4,
            name: 'Noord Street Taxi Rank',
            location: 'Noord Street, Johannesburg',
            coordinates: { lat: -26.1988, lng: 28.0394 },
            routes: ['Mamelodi', 'Centurion', 'Hatfield', 'Sunnyside'],
            operating_hours: '05:30 - 21:00'
          }
        ]

        return new Response(JSON.stringify({ taxi_ranks: taxiRanks }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'find_nearby_drivers':
        // Simulate finding nearby drivers based on location
        const mockDrivers = [
          {
            id: '1',
            name: 'Sipho M.',
            rating: 4.8,
            vehicle: 'Toyota Quantum',
            plate: 'CA 123 456',
            distance: 0.8,
            eta: 3,
            location: { lat: pickup_lat + 0.001, lng: pickup_lng + 0.001 }
          },
          {
            id: '2',
            name: 'Nomsa K.',
            rating: 4.9,
            vehicle: 'Nissan NV200',
            plate: 'CA 789 012',
            distance: 1.2,
            eta: 5,
            location: { lat: pickup_lat - 0.002, lng: pickup_lng + 0.003 }
          },
          {
            id: '3',
            name: 'Thabo L.',
            rating: 4.7,
            vehicle: 'Toyota Hiace',
            plate: 'CA 456 789',
            distance: 1.8,
            eta: 7,
            location: { lat: pickup_lat + 0.003, lng: pickup_lng - 0.002 }
          }
        ]

        const searchRadius = radius || 5
        const nearbyDrivers = mockDrivers.filter(driver => driver.distance <= searchRadius)

        return new Response(JSON.stringify({ drivers: nearbyDrivers }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'update_driver_location':
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
          return new Response(JSON.stringify({ error: 'Authorization required' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401
          })
        }

        const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))
        if (!user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401
          })
        }

        // Update driver location
        const { error: locationError } = await supabaseClient
          .from('drivers')
          .update({
            current_location: `(${location.lat},${location.lng})`,
            heading: location.heading,
            speed: location.speed,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)

        if (locationError) {
          return new Response(JSON.stringify({ error: locationError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        return new Response(JSON.stringify({ message: 'Location updated successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'get_route_details':
        // Calculate route details between two points
        const routeDetails = {
          distance: Math.floor(Math.random() * 20) + 5, // 5-25 km
          duration: Math.floor(Math.random() * 45) + 15, // 15-60 minutes
          estimated_fare: Math.floor(Math.random() * 50) + 10, // R10-60
          alternative_routes: 2
        }

        return new Response(JSON.stringify({ route: routeDetails }), {
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