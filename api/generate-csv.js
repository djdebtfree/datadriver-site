// POST /api/generate-csv
// After payment confirmed: query Data Driver Supabase for full records,
// generate CSV, store in Supabase Storage, return download URL
// Body: { purchase_id }

import { createClient } from '@supabase/supabase-js';

// Client DB (our new project)
const clientsDb = createClient(
  process.env.SUPABASE_CLIENTS_URL,
  process.env.SUPABASE_CLIENTS_SERVICE_KEY
);

// Data Driver DB (segment data)
const dataDb = createClient(
  process.env.SUPABASE_DATA_URL || 'https://smfgkhlwoszldfsxkvib.supabase.co',
  process.env.SUPABASE_DATA_SERVICE_KEY
);

const CSV_COLUMNS = [
  'First_Name', 'Last_Name', 'Address', 'City', 'State', 'Zip_Code',
  'Age', 'Gender', 'Married', 'Homeowner', 'Children',
  'Net_Worth', 'Income_Range', 'Credit_Rating',
  'Personal_Email', 'Phone', 'LinkedIn_URL',
  'Company_Name', 'Job_Title', 'Business_Email', 'Lead_Time'
];

function escapeCsv(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function buildCsv(rows) {
  const header = CSV_COLUMNS.join(',');
  const lines = rows.map(row =>
    CSV_COLUMNS.map(col => escapeCsv(row[col])).join(',')
  );
  return header + '\n' + lines.join('\n');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { purchase_id } = req.body;
  if (!purchase_id) {
    return res.status(400).json({ error: 'purchase_id required' });
  }

  try {
    // 1. Get purchase details
    const { data: purchase, error: purchaseErr } = await clientsDb
      .from('purchases')
      .select('*, clients(email, first_name, last_name)')
      .eq('id', purchase_id)
      .single();

    if (purchaseErr || !purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    if (purchase.status !== 'paid') {
      return res.status(403).json({ error: 'Payment not confirmed yet' });
    }

    // If CSV already generated, return existing URL
    if (purchase.csv_storage_path && purchase.status === 'delivered') {
      const { data: urlData } = await clientsDb.storage
        .from('purchase-csvs')
        .createSignedUrl(purchase.csv_storage_path, 3600); // 1hr expiry
      return res.status(200).json({ download_url: urlData?.signedUrl, already_generated: true });
    }

    // 2. Build query from saved filters
    const filters = purchase.filters_json || {};
    const tableName = purchase.target_market;
    const limit = purchase.record_count;

    // Build Supabase query against the Data Driver segment table
    let query = dataDb.from(tableName).select(CSV_COLUMNS.join(','));

    // Apply filters
    if (filters.states?.length) query = query.in('State', filters.states);
    if (filters.cities?.length) query = query.in('City', filters.cities);
    if (filters.zipCodes?.length) query = query.in('Zip_Code', filters.zipCodes);
    if (filters.ageMin) query = query.gte('Age', filters.ageMin);
    if (filters.ageMax) query = query.lte('Age', filters.ageMax);
    if (filters.gender?.length) query = query.in('Gender', filters.gender);
    if (filters.maritalStatus?.length) query = query.in('Married', filters.maritalStatus);
    if (filters.homeowner?.length) query = query.in('Homeowner', filters.homeowner);
    if (filters.children?.length) query = query.in('Children', filters.children);
    if (filters.creditRating?.length) query = query.in('Credit_Rating', filters.creditRating);
    if (filters.householdIncome?.length) query = query.in('Income_Range', filters.householdIncome);
    if (filters.netWorth?.length) query = query.in('Net_Worth', filters.netWorth);

    query = query.limit(limit);

    const { data: records, error: queryErr } = await query;

    if (queryErr) {
      console.error('Data query error:', queryErr);
      return res.status(500).json({ error: 'Failed to query records' });
    }

    if (!records || records.length === 0) {
      return res.status(404).json({ error: 'No records found matching filters' });
    }

    // 3. Generate CSV
    const csvContent = buildCsv(records);

    // 4. Store in Supabase Storage
    const fileName = `${purchase.client_id}/${purchase_id}_${Date.now()}.csv`;
    const { error: uploadErr } = await clientsDb.storage
      .from('purchase-csvs')
      .upload(fileName, csvContent, {
        contentType: 'text/csv',
        upsert: false,
      });

    if (uploadErr) {
      console.error('Storage upload error:', uploadErr);
      // Still deliver the CSV even if storage fails
    }

    // 5. Update purchase record
    await clientsDb
      .from('purchases')
      .update({
        status: 'delivered',
        csv_storage_path: fileName,
      })
      .eq('id', purchase_id);

    // 6. Create signed download URL (1 hour)
    const { data: urlData } = await clientsDb.storage
      .from('purchase-csvs')
      .createSignedUrl(fileName, 3600);

    return res.status(200).json({
      download_url: urlData?.signedUrl || null,
      record_count: records.length,
      purchase_id,
      // Also return CSV as base64 fallback if storage failed
      csv_base64: !urlData?.signedUrl ? Buffer.from(csvContent).toString('base64') : undefined,
    });

  } catch (err) {
    console.error('generate-csv error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
