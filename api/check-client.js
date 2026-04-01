// POST /api/check-client
// Looks up a client by email in Supabase + Stripe
// Returns: { found: bool, client: {...} | null }

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_CLIENTS_URL,
  process.env.SUPABASE_CLIENTS_SERVICE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ found: false, error: 'Valid email required' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();

    // Check Supabase
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found (expected for new clients)
      console.error('Supabase lookup error:', error);
      return res.status(500).json({ found: false, error: 'Database error' });
    }

    if (client) {
      return res.status(200).json({
        found: true,
        client: {
          id: client.id,
          email: client.email,
          first_name: client.first_name,
          last_name: client.last_name,
          phone: client.phone,
          stripe_customer_id: client.stripe_customer_id,
        }
      });
    }

    return res.status(200).json({ found: false, client: null });

  } catch (err) {
    console.error('check-client error:', err);
    return res.status(500).json({ found: false, error: 'Internal server error' });
  }
}
