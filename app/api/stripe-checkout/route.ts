import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/app/auth/getUser';
import { v4 as uuidv4 } from 'uuid'; // Add this import

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { price } = await request.json();
  const supabase = await createClient();
  const user = await getUser();
  const userId = user?.id;

  if (!userId) {
    return NextResponse.json(
      { error: 'User not authenticated' },
      { status: 401 }
    );
  }

  try {
    const product = await stripe.products.create({
      name: price === 900 ? 'Basic Plan' : 'Pro Plan',
    });

    const priceObj = await stripe.prices.create({
      product: product.id,
      unit_amount: price,
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceObj.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      customer_email: user.email,
      metadata: {
        user_id: userId,
        plan_type: price === 900 ? 'basic' : 'pro'
      }
    });

    const referenceId = uuidv4();

    const { error } = await supabase
      .from('receipts')
      .insert({
        user_id: userId,
        email: user.email,
        amount_paid: price === 900 ? 9 : 24,
        stripe_session_id: session.id,
        reference_id: referenceId
      });

    if (error) {
      console.error('Supabase error:', error);
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json(
      { error: 'Failed to create Stripe checkout session' },
      { status: 500 }
    );
  }
}