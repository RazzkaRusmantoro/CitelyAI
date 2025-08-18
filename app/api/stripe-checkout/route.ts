import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/app/auth/getUser';
import { v4 as uuidv4 } from 'uuid';

console.log("Hi")
const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!);
console.log("Hi again")

const STRIPE_PRICE_IDS = {
  basic: process.env.STRIPE_BASIC_PRICE_ID!, // price_ID for $9 Basic plan
  pro: process.env.STRIPE_PRO_PRICE_ID!     // price_ID for $24 Pro plan
};

console.log("Whats up")

export async function POST(request: Request) {
  const { price } = await request.json();
  const supabase = await createClient();
  const user = await getUser();
  const userId = user?.id;
  const userEmail = user?.email;

  console.log("Were here")

  if (!userId) {
    return NextResponse.json(
      { error: 'User not authenticated' },
      { status: 401 }
    );
  }

  console.log("were here again")

  try {
    const priceId = price === 900 ? STRIPE_PRICE_IDS.basic : STRIPE_PRICE_IDS.pro;
    const planType = price === 900 ? 'basic' : 'pro';
    const planName = price === 900 ? 'Basic' : 'Pro';

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      customer_email: user.email,
      metadata: {
        user_id: userId,
        plan_type: planType,
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          plan_type: planType,
        }
      }
    });

    console.log("test")


    // Update subscription record in Supabase
  //   const { error: subError } = await supabase
  //     .from('Subscriptions')
  //     .upsert({
  //       user_id: userId,
  //       stripe_session_id: session.id,
  //       subscription: planName,
  //       status: 'pending_payment',
  //       current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  //     },
  //     { onConflict: 'user_id' }
  // );
    
  //   console.log("hey")
  //   if (subError) throw subError;

    console.log("yes")

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { 
        error: 'Failed to create Stripe checkout session',
        details: err instanceof Error ? err.message : String(err)
      },
      { status: 500 }
    );
  }
}