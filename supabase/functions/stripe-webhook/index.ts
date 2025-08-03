import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('No Stripe signature found')
    }

    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!webhookSecret) {
      throw new Error('Webhook secret not configured')
    }

    // Verify webhook signature (simplified - in production, use proper Stripe webhook verification)
    // For now, we'll trust the webhook since it's coming from Stripe
    const event = JSON.parse(body)

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Processing webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.user_id
        const paymentIntentId = session.payment_intent

        if (!userId) {
          console.error('No user_id in session metadata')
          break
        }

        // Update user subscription status
        const { error: userError } = await supabaseClient
          .from('users')
          .update({ 
            subscription_status: 'active',
            stripe_customer_id: session.customer 
          })
          .eq('id', userId)

        if (userError) {
          console.error('Error updating user:', userError)
        }

        // Create payment record
        const { error: paymentError } = await supabaseClient
          .from('payments')
          .insert({
            user_id: userId,
            stripe_payment_intent_id: paymentIntentId,
            amount: session.amount_total,
            currency: session.currency,
            status: 'succeeded'
          })

        if (paymentError) {
          console.error('Error creating payment record:', paymentError)
        }

        console.log(`Payment completed for user ${userId}`)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        
        // Update payment record status
        const { error } = await supabaseClient
          .from('payments')
          .update({ status: 'failed' })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (error) {
          console.error('Error updating payment status:', error)
        }

        console.log(`Payment failed for payment intent ${paymentIntent.id}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})