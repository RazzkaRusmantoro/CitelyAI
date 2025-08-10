// import { NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import { createClient } from '@/utils/supabase/server';

// const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!);
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// export async function POST(request: Request) {
//   const payload = await request.text();
//   const signature = request.headers.get('stripe-signature')!;

//   try {
//     const event = stripe.webhooks.constructEvent(
//       payload,
//       signature,
//       webhookSecret
//     );

//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object as Stripe.Checkout.Session;

//       // Update the receipt in Supabase
//       const supabase = await createClient();
//       const { error } = await supabase
//         .from('receipts')
//         .update({
//           payment_method: session.payment_method_types?.[0],
//         })
//         .eq('stripe_session_id', session.id);

//       if (error) {
//         console.error('Failed to update receipt:', error);
//       }
//     }

//     return NextResponse.json({ received: true });
//   } catch (err) {
//     console.error('Webhook error:', err);
//     return NextResponse.json(
//       { error: 'Webhook handler failed' },
//       { status: 400 }
//     );
//   }
// }