// app/api/stripe-webhook/route.ts
import { buffer } from 'micro'
import { stripe } from '../../utlis/stripe'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const rawBody = await req.arrayBuffer();
    const buf = Buffer.from(rawBody);
  const sig = req.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.log(`Webhook error: ${err.message}`)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.created':
      await fetch('https://mybranzretention.com/api/stripe/csc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
      break
    case 'customer.subscription.deleted':
      await fetch('https://mybranzretention.com/api/stripe/csd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
      break
    case 'customer.subscription.updated':
      await fetch('https://mybranzretention.com/api/stripe/csu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
      break
  }

  return NextResponse.json({ received: true })
}
