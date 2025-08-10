import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, context, history } = await req.json()

    // Simulate AI assistant response based on common taxi app queries
    const lowerMessage = message.toLowerCase()
    let response = ''

    if (lowerMessage.includes('book') || lowerMessage.includes('ride')) {
      response = "To book a ride:\n\n1. Enter your pickup location\n2. Enter your destination\n3. Choose shared or private ride\n4. Select payment method\n5. Confirm your booking\n\nNeed help with any specific step?"
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('wallet')) {
      response = "For payment issues:\n\n• Check your wallet balance in the Wallet section\n• You can top up using cards, bank transfers, or mobile money\n• Trip payments are automatically deducted from your wallet\n• For payment failures, try a different payment method\n\nWhat specific payment issue can I help with?"
    } else if (lowerMessage.includes('driver') || lowerMessage.includes('late')) {
      response = "For driver-related concerns:\n\n• Drivers typically arrive within 5-10 minutes\n• You can track your driver's location in real-time\n• Use the call feature to contact your driver\n• If there's a delay, you can cancel and rebook\n\nWould you like me to help you contact your driver?"
    } else if (lowerMessage.includes('cancel') || lowerMessage.includes('refund')) {
      response = "Cancellation and refunds:\n\n• You can cancel rides before the driver arrives\n• Free cancellation within 2 minutes of booking\n• After pickup, cancellation fees may apply\n• Refunds are processed within 24 hours to your wallet\n\nDo you need to cancel a current booking?"
    } else if (lowerMessage.includes('safety') || lowerMessage.includes('emergency')) {
      response = "Safety features:\n\n• All drivers are verified and tracked\n• Use the emergency button for immediate help\n• Share your trip details with contacts\n• Rate drivers after each trip\n• Report any issues through the app\n\nAre you currently in an emergency situation?"
    } else if (lowerMessage.includes('account') || lowerMessage.includes('profile')) {
      response = "Account management:\n\n• Update your profile in Settings\n• Add emergency contacts for safety\n• Manage payment methods\n• View trip history\n• Adjust notification preferences\n\nWhat would you like to update in your account?"
    } else {
      response = "I'm here to help with your SA Taxi Connect experience! I can assist with:\n\n🚗 Booking rides\n💳 Payment & wallet issues\n👨‍✈️ Driver concerns\n❌ Cancellations & refunds\n🛡️ Safety features\n👤 Account settings\n\nWhat can I help you with today?"
    }

    return new Response(JSON.stringify({ 
      response,
      timestamp: new Date().toISOString(),
      context: 'taxi_app_support'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      response: "I'm sorry, I'm having trouble processing your request right now. Please try again or contact our support team directly.",
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})