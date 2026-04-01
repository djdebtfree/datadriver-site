// POST /api/webhook
// Stripe webhook — fires after successful payment
// Updates purchase status, triggers CSV generation

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_CLIENTS_URL,
  process.env.SUPABASE_CLIENTS_SERVICE_KEY
);

// For Vercel: need raw body for signature verification
export const config = {
  api: { bodyParser: false }
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function verifyStripeSignature(rawBody, sig) {
  // Simple HMAC verification without stripe SDK
  const crypto = await import('crypto');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return true; // Skip if no secret configured yet

  const elements = sig.split(',');
  const timestamp = elements.find(e => e.startsWith('t='))?.split('=')[1];
  const signature = elements.find(e => e.startsWith('v1='))?.split('=')[1];

  if (!timestamp || !signature) return false;

  const payload = `${timestamp}.${rawBody.toString()}`;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const rawBody = await getRawBody(req);
    const sig = req.headers['stripe-signature'] || '';

    // Verify signature
    const valid = await verifyStripeSignature(rawBody, sig);
    if (!valid) {
      console.error('Invalid Stripe signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(rawBody.toString());

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const purchaseId = session.metadata?.purchase_id;
      const clientId = session.metadata?.client_id;

      if (!purchaseId) {
        console.error('No purchase_id in session metadata');
        return res.status(200).json({ received: true });
      }

      // Update purchase status to paid
      const { error: updateErr } = await supabase
        .from('purchases')
        .update({
          status: 'paid',
          stripe_payment_id: session.payment_intent || session.id,
        })
        .eq('id', purchaseId);

      if (updateErr) {
        console.error('Failed to update purchase:', updateErr);
      }

      console.log(`Payment confirmed for purchase ${purchaseId}, client ${clientId}`);
    }

    return res.status(200).json({ received: true });

  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
