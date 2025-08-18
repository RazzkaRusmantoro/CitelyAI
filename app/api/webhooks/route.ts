// app/api/stripe-webhook/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/app/auth/getUser';
import { v4 as uuidv4 } from 'uuid';

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature')!;
  const supabase = await createClient();
  
  

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
        // When checkout completes (subscription or one-time)
        const session = event.data.object as Stripe.Checkout.Session;

        await supabase
        .from('Subscriptions')
        .update({
            status: 'active',
            stripe_subscription_id: session.subscription,
            current_period_end: new Date(
            (session.expires_at ?? 0) * 1000
            ).toISOString(),
        })
        .eq('stripe_session_id', session.id);

        break;
    }

    // Subscription created
    case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;

        console.log("Customer subscription creating.")

        await supabase
        .from('Subscriptions')
        .update({
            status: subscription.status,
            current_period_end: new Date(
                subscription.items.data[0].current_period_end * 1000
            ).toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);

        console.log("Customer subscription created.")

        break;
    }

    // Subscription updated (renewal, plan change, pause, etc.)
    case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase
        .from('Subscriptions')
        .update({
            status: subscription.status,
            current_period_end: new Date(
                subscription.items.data[0].current_period_end * 1000
            ).toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);

        break;
    }

    // Subscription cancelled (manual or failed payment)
    case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase
        .from('Subscriptions')
        .update({
            status: 'cancelled',
            subscription: 'Free'
        })
        .eq('stripe_subscription_id', subscription.id);

        break;
    }

    case 'invoice.payment_succeeded': {
        console.log("Invoice payment succeeded.")
        const invoice = event.data.object as Stripe.Invoice;
                 
        const newReferenceId = uuidv4();

        const subscriptionId = invoice.parent?.subscription_details?.subscription;
            if (typeof subscriptionId === 'string') {
                console.log("Exists")
                // Now you can safely use the subscription
            } else {
                // Handle the case where subscription ID is missing
                throw new Error('No subscription ID found on invoice');
            }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        console.log("This is the subscription:", subscription)

        const userId = subscription.metadata.user_id;

        await supabase.from('receipts').insert({
            reference_id: newReferenceId,
            user_id: userId,
            email: invoice.customer_email,
            amount_paid: invoice.amount_paid / 100,
            stripe_invoice_id: invoice.id,
        });

        console.log("Confirming invoice payment successful")
        console.log("This is the userId", userId)
        console.log("This is the subscription id:", subscriptionId)

        console.log("This is the invoice:", invoice)

        break;
    }

    case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        // Update subscription to "past_due" or take action
        await supabase
        .from('Subscriptions')
        .update({
            status: 'past_due',
        })
        .eq('stripe_subscription_id', invoice.parent?.subscription_details?.subscription);
        
        console.log("This is the subscription id:", invoice.parent?.subscription_details?.subscription)

        break;
    }
    
    // PaymentIntent succeeded (useful for one-time charges)
    case 'payment_intent.succeeded': {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent ${intent.id} succeeded`);
        break;
    }

    // PaymentIntent failed
    case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.error(`PaymentIntent ${intent.id} failed`);
        break;
    }

    // Charge dispute created
    case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        console.warn(`Dispute created for charge ${dispute.charge}`);
        break;
    }

    // Charge dispute closed
    case 'charge.dispute.closed': {
        const dispute = event.data.object as Stripe.Dispute;
        console.log(`Dispute closed for charge ${dispute.charge}`);
        break;
    }

    // Customer deleted from Stripe
    case 'customer.deleted': {
        console.log("Deleting customer.")
        const customer = event.data.object as Stripe.Customer;
        const userId = (event.data.object as any).metadata.user_id;

        await supabase
            .from('Subscriptions')
            .update({
                status: 'cancelled',
                subscription: 'Free',
                stripe_session_id: null,
                subscription_session_id: null,
                current_period_end: null,
            })
            .eq('user_id', userId);

        console.log("Customer deleted.")

        break;
    }

    default:
        console.log(`Unhandled event type ${event.type}`);
    }

  return NextResponse.json({ received: true });
}
