// POST /api/create-client
// Creates a new client in Supabase + Stripe
// Body: { email, first_name, last_name, phone }

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_CLIENTS_URL,
  process.env.SUPABASE_CLIENTS_SERVICE_KEY
);

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;

async function createStripeCustomer({ email, first_name, last_name, phone }) {
  const params = new URLSearchParams();
  params.append('email', email);
  if (first_name || last_name) params.append('name', `${first_name || ''} ${last_name || ''}`.trim());
  if (phone) params.append('phone', phone);
  params.append('metadata[source]', 'data-driver-form');

  const resp = await fetch('https://api.stripe.com/v1/customers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  return resp.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, first_name, last_name, phone } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'First and last name required' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Create Stripe customer
    const stripeCustomer = await createStripeCustomer({
      email: cleanEmail, first_name, last_name, phone
    });

    if (stripeCustomer.error) {
      console.error('Stripe error:', stripeCustomer.error);
      return res.status(500).json({ error: 'Failed to create Stripe customer' });
    }

    // 2. Create Supabase client record
    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        email: cleanEmail,
        first_name,
        last_name,
        phone: phone || null,
        stripe_customer_id: stripeCustomer.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      // If duplicate email, fetch existing
      if (error.code === '23505') {
        const { data: existing } = await supabase
          .from('clients')
          .select('*')
          .eq('email', cleanEmail)
          .single();
        return res.status(200).json({ client: existing, existing: true });
      }
      return res.status(500).json({ error: 'Failed to create client record' });
    }

    return res.status(201).json({
      client: {
        id: client.id,
        email: client.email,
        first_name: client.first_name,
        last_name: client.last_name,
        phone: client.phone,
        stripe_customer_id: client.stripe_customer_id,
      },
      existing: false
    });

  } catch (err) {
    console.error('create-client error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
