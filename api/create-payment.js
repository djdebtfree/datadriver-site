// POST /api/create-payment
// Creates a Stripe payment link for the lead purchase
// Body: { client_id, stripe_customer_id, record_count, filters }

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_CLIENTS_URL,
  process.env.SUPABASE_CLIENTS_SERVICE_KEY
);

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const PRICE_STANDARD = 'price_1THRhpAlROxZG9iH90PqrSM8'; // $0.25
const PRICE_VOLUME = 'price_1THRmkAlROxZG9iHJAQe5ZZh';   // $0.20
const MIN_RECORDS = 100;
const VOLUME_THRESHOLD = 5000;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { client_id, stripe_customer_id, record_count, filters, target_market } = req.body;

  if (!client_id || !stripe_customer_id) {
    return res.status(400).json({ error: 'Client ID and Stripe customer ID required' });
  }
  if (!record_count || record_count < MIN_RECORDS) {
    return res.status(400).json({ error: `Minimum ${MIN_RECORDS} records required` });
  }
  if (!target_market) {
    return res.status(400).json({ error: 'Target market required' });
  }

  try {
    // Determine pricing
    const priceId = record_count >= VOLUME_THRESHOLD ? PRICE_VOLUME : PRICE_STANDARD;
    const pricePerRecord = record_count >= VOLUME_THRESHOLD ? 0.20 : 0.25;
    const totalAmount = Math.round(record_count * pricePerRecord * 100); // in cents

    // Create purchase record in Supabase (pending)
    const { data: purchase, error: purchaseErr } = await supabase
      .from('purchases')
      .insert({
        client_id,
        target_market,
        filters_json: filters || {},
        record_count,
        price_per_record: pricePerRecord,
        amount_paid: record_count * pricePerRecord,
        status: 'pending',
      })
      .select()
      .single();

    if (purchaseErr) {
      console.error('Purchase insert error:', purchaseErr);
      return res.status(500).json({ error: 'Failed to create purchase record' });
    }

    // Create Stripe Checkout Session
    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('customer', stripe_customer_id);
    params.append('line_items[0][price]', priceId);
    params.append('line_items[0][quantity]', String(record_count));
    params.append('metadata[purchase_id]', purchase.id);
    params.append('metadata[client_id]', client_id);
    params.append('metadata[record_count]', String(record_count));
    params.append('success_url', `${process.env.APP_URL || 'https://datadriver-site.vercel.app'}/success.html?purchase_id=${purchase.id}`);
    params.append('cancel_url', `${process.env.APP_URL || 'https://datadriver-site.vercel.app'}?cancelled=true`);

    const sessionResp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await sessionResp.json();

    if (session.error) {
      console.error('Stripe session error:', session.error);
      return res.status(500).json({ error: 'Failed to create payment session' });
    }

    // Update purchase with Stripe session ID
    await supabase
      .from('purchases')
      .update({ stripe_payment_id: session.id })
      .eq('id', purchase.id);

    return res.status(200).json({
      checkout_url: session.url,
      purchase_id: purchase.id,
      record_count,
      price_per_record: pricePerRecord,
      total: record_count * pricePerRecord,
    });

  } catch (err) {
    console.error('create-payment error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
