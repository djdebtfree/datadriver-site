// POST /api/fathom-webhook
// Receives Fathom Video webhooks — call recordings, transcripts, AI summaries
// Logs to Supabase and optionally pushes to GHL

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_CLIENTS_URL,
  process.env.SUPABASE_CLIENTS_SERVICE_KEY
);

const WEBHOOK_SECRET = process.env.FATHOM_WEBHOOK_SECRET;

// Verify Fathom webhook signature
function verifySignature(payload, signature) {
  if (!WEBHOOK_SECRET || !signature) return !WEBHOOK_SECRET; // skip if no secret configured
  const computed = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computed));
  } catch {
    return false;
  }
}

// Need raw body for signature verification
export const config = {
  api: { bodyParser: false }
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-fathom-signature'] || req.headers['x-webhook-signature'] || '';

    // Verify signature
    if (!verifySignature(rawBody.toString(), signature)) {
      console.error('[Fathom Webhook] Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(rawBody.toString());
    const eventType = event.type || event.event || 'unknown';
    const timestamp = new Date().toISOString();

    console.log(`[Fathom Webhook] Received: ${eventType} at ${timestamp}`);

    // Store every event in Supabase for processing
    const { error: insertError } = await supabase
      .from('fathom_events')
      .insert({
        event_type: eventType,
        payload: event,
        received_at: timestamp,
        processed: false,
      });

    if (insertError) {
      console.error('[Fathom Webhook] DB insert error:', insertError);
      // Don't fail the webhook — Fathom will retry
    }

    // Handle specific event types
    if (eventType === 'call.completed' || eventType === 'recording.ready') {
      const callData = event.data || event.call || event;
      console.log(`[Fathom Webhook] Call completed: ${callData.title || callData.id}`);

      // Extract key fields
      const record = {
        fathom_call_id: callData.id || callData.call_id,
        title: callData.title || 'Untitled Call',
        duration_seconds: callData.duration || callData.duration_seconds,
        recording_url: callData.recording_url || callData.video_url,
        transcript: callData.transcript || null,
        summary: callData.summary || callData.ai_summary || null,
        participants: callData.participants || callData.attendees || [],
        event_type: eventType,
        raw_payload: event,
        created_at: timestamp,
      };

      const { error: callError } = await supabase
        .from('fathom_calls')
        .upsert(record, { onConflict: 'fathom_call_id' });

      if (callError) {
        console.error('[Fathom Webhook] Call upsert error:', callError);
      }
    }

    if (eventType === 'transcript.ready') {
      const data = event.data || event;
      console.log(`[Fathom Webhook] Transcript ready for call: ${data.call_id}`);

      await supabase
        .from('fathom_calls')
        .update({
          transcript: data.transcript || data.text,
          updated_at: timestamp,
        })
        .eq('fathom_call_id', data.call_id || data.id);
    }

    if (eventType === 'summary.ready') {
      const data = event.data || event;
      console.log(`[Fathom Webhook] Summary ready for call: ${data.call_id}`);

      await supabase
        .from('fathom_calls')
        .update({
          summary: data.summary || data.ai_summary,
          updated_at: timestamp,
        })
        .eq('fathom_call_id', data.call_id || data.id);
    }

    return res.status(200).json({ received: true, event: eventType });

  } catch (err) {
    console.error('[Fathom Webhook] Error:', err);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
