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

    const { action, notificationId, settings } = await req.json()

    switch (action) {
      case 'get_notifications':
        const { data: notifications, error: getError } = await supabaseClient
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (getError) {
          return new Response(JSON.stringify({ error: getError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        return new Response(JSON.stringify({ notifications }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'mark_as_read':
        const { error: readError } = await supabaseClient
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notificationId)
          .eq('user_id', user.id)

        if (readError) {
          return new Response(JSON.stringify({ error: readError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        return new Response(JSON.stringify({ message: 'Notification marked as read' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'mark_all_as_read':
        const { error: allReadError } = await supabaseClient
          .from('notifications')
          .update({ is_read: true })
          .eq('user_id', user.id)
          .eq('is_read', false)

        if (allReadError) {
          return new Response(JSON.stringify({ error: allReadError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        return new Response(JSON.stringify({ message: 'All notifications marked as read' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'update_settings':
        const { error: settingsError } = await supabaseClient
          .from('notification_settings')
          .upsert({
            user_id: user.id,
            ...settings,
            updated_at: new Date().toISOString()
          })

        if (settingsError) {
          return new Response(JSON.stringify({ error: settingsError.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          })
        }

        return new Response(JSON.stringify({ message: 'Notification settings updated' }), {
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