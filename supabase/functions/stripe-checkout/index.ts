import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Bolt Integration',
    version: '1.0.0',
  },
});

// Helper function to create responses with CORS headers
function corsResponse(body: string | object | null, status = 200) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  // For 204 No Content, don't include Content-Type or body
  if (status === 204) {
    return new Response(null, { status, headers });
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return corsResponse({}, 204);
    }

    if (req.method !== 'POST') {
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    const { price_id, success_url, cancel_url, mode, customer_email } = await req.json();

    const error = validateParameters(
      { price_id, success_url, cancel_url, mode },
      {
        cancel_url: 'string',
        price_id: 'string',
        success_url: 'string',
        mode: { values: ['payment', 'subscription'] },
      },
    );

    if (error) {
      return corsResponse({ error }, 400);
    }

    // Check if user is authenticated
    const authHeader = req.headers.get('Authorization');
    let user = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const {
        data: { user: authUser },
        error: getUserError,
      } = await supabase.auth.getUser(token);
      
      if (!getUserError && authUser) {
        user = authUser;
      }
    }

    let customerId;
    let shouldCreateUserAfterPayment = false;

    if (user) {
      // User is authenticated - check for existing customer
      const { data: customer, error: getCustomerError } = await supabase
        .from('stripe_customers')
        .select('customer_id')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .maybeSingle();

      if (getCustomerError) {
        console.error('Failed to fetch customer information from the database', getCustomerError);
        return corsResponse({ error: 'Failed to fetch customer information' }, 500);
      }

      if (!customer || !customer.customer_id) {
        // Create new customer for authenticated user
        const newCustomer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
          },
        });

        console.log(`Created new Stripe customer ${newCustomer.id} for user ${user.id}`);

        const { error: createCustomerError } = await supabase.from('stripe_customers').insert({
          user_id: user.id,
          customer_id: newCustomer.id,
        });

        if (createCustomerError) {
          console.error('Failed to save customer information in the database', createCustomerError);
          try {
            await stripe.customers.del(newCustomer.id);
            await supabase.from('stripe_subscriptions').delete().eq('customer_id', newCustomer.id);
          } catch (deleteError) {
            console.error('Failed to clean up after customer mapping error:', deleteError);
          }
          return corsResponse({ error: 'Failed to create customer mapping' }, 500);
        }

        if (mode === 'subscription') {
          const { error: createSubscriptionError } = await supabase.from('stripe_subscriptions').insert({
            customer_id: newCustomer.id,
            status: 'not_started',
          });

          if (createSubscriptionError) {
            console.error('Failed to save subscription in the database', createSubscriptionError);
            try {
              await stripe.customers.del(newCustomer.id);
            } catch (deleteError) {
              console.error('Failed to delete Stripe customer after subscription creation error:', deleteError);
            }
            return corsResponse({ error: 'Unable to save the subscription in the database' }, 500);
          }
        }

        customerId = newCustomer.id;
      } else {
        customerId = customer.customer_id;

        if (mode === 'subscription') {
          const { data: subscription, error: getSubscriptionError } = await supabase
            .from('stripe_subscriptions')
            .select('status')
            .eq('customer_id', customerId)
            .maybeSingle();

          if (getSubscriptionError) {
            console.error('Failed to fetch subscription information from the database', getSubscriptionError);
            return corsResponse({ error: 'Failed to fetch subscription information' }, 500);
          }

          if (!subscription) {
            const { error: createSubscriptionError } = await supabase.from('stripe_subscriptions').insert({
              customer_id: customerId,
              status: 'not_started',
            });

            if (createSubscriptionError) {
              console.error('Failed to create subscription record for existing customer', createSubscriptionError);
              return corsResponse({ error: 'Failed to create subscription record for existing customer' }, 500);
            }
          }
        }
      }
    } else {
      // Guest checkout - create customer without user association
      const customerData: any = {};
      
      if (customer_email) {
        customerData.email = customer_email;
        customerData.metadata = {
          guest_checkout: 'true',
          checkout_email: customer_email,
        };
      }
      
      const newCustomer = await stripe.customers.create(customerData);
      customerId = newCustomer.id;
      shouldCreateUserAfterPayment = !!customer_email;
      
      console.log(`Created guest customer ${customerId} for email ${customer_email}`);
    }

    // Create Checkout Session
    const sessionData: any = {
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode,
      success_url,
      cancel_url,
    };

    // Add metadata for guest checkouts
    if (!user && customer_email) {
      sessionData.metadata = {
        guest_checkout: 'true',
        checkout_email: customer_email,
        should_create_user: 'true',
      };
    }

    const session = await stripe.checkout.sessions.create(sessionData);

    console.log(`Created checkout session ${session.id} for customer ${customerId}`);

    return corsResponse({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error(`Checkout error: ${error.message}`);
    return corsResponse({ error: error.message }, 500);
  }
});

// Add customer_email as optional parameter
function validateParameters<T extends Record<string, any>>(values: T, expected: Expectations<T>): string | undefined {
  for (const parameter in values) {
    const expectation = expected[parameter];
  }
});

type ExpectedType = 'string' | { values: string[] };
type Expectations<T> = { [K in keyof T]: ExpectedType };

function validateParameters<T extends Record<string, any>>(values: T, expected: Expectations<T>): string | undefined {
  for (const parameter in values) {
    const expectation = expected[parameter];
    const value = values[parameter];

    if (expectation === 'string') {
      if (value == null) {
        return `Missing required parameter ${parameter}`;
      }
      if (typeof value !== 'string') {
        return `Expected parameter ${parameter} to be a string got ${JSON.stringify(value)}`;
      }
    } else {
      if (!expectation.values.includes(value)) {
        return `Expected parameter ${parameter} to be one of ${expectation.values.join(', ')}`;
      }
    }
  }

  return undefined;
}