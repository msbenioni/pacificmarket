const { Client } = require('pg');

const connectionString = 'postgresql://postgres:MontBlanc3001@db.mnmisjprswpuvcojnbip.supabase.co:5432/postgres';

async function main() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected.\n');

  // Check businesses table columns
  const bizCols = await client.query(
    "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'businesses' ORDER BY ordinal_position"
  );
  console.log('=== businesses TABLE ===');
  if (bizCols.rows.length === 0) {
    console.log('  TABLE DOES NOT EXIST');
  } else {
    bizCols.rows.forEach(r => console.log('  ' + r.column_name + ' [' + r.data_type + ']'));
  }
  console.log('');

  // Check discovered_businesses sample data
  const sample = await client.query(
    "SELECT name, website, email, phone, region, confidence FROM discovered_businesses LIMIT 5"
  );
  console.log('=== SAMPLE discovered_businesses (5 rows) ===');
  sample.rows.forEach(r => console.log('  ' + r.name + ' | ' + (r.website || '-') + ' | ' + (r.email || '-') + ' | ' + (r.region || '-') + ' | conf:' + r.confidence));

  const count = await client.query("SELECT COUNT(*) as total FROM discovered_businesses");
  console.log('\nTotal discovered: ' + count.rows[0].total);

  // Focus on discovery-related tables only
  const targetTables = ['discovered_businesses', 'daily_reports', 'quality_alerts', 'email_groups', 'email_campaigns', 'error_logs', 'scheduler_config'];

  for (const table of targetTables) {
    const cols = await client.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 ORDER BY ordinal_position",
      [table]
    );
    if (cols.rows.length === 0) {
      console.log(table + ': MISSING');
    } else {
      console.log(table + ': OK (' + cols.rows.length + ' cols)');
      cols.rows.forEach(r => console.log('  ' + r.column_name + ' [' + r.data_type + ']'));
    }
  }

  // RLS for discovery tables
  console.log('\n=== RLS STATUS ===');
  const rls = await client.query(
    "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = ANY($1)",
    [targetTables]
  );
  rls.rows.forEach(r => console.log(r.tablename + ': ' + (r.rowsecurity ? 'ENABLED' : 'DISABLED')));

  // Policies for discovery tables
  console.log('\n=== RLS POLICIES ===');
  const policies = await client.query(
    "SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public' AND tablename = ANY($1) ORDER BY tablename",
    [targetTables]
  );
  if (policies.rows.length === 0) {
    console.log('None');
  } else {
    policies.rows.forEach(r => console.log(r.tablename + ': ' + r.policyname + ' (' + r.cmd + ')'));
  }

  // Triggers
  console.log('\n=== TRIGGERS ===');
  const triggers = await client.query(
    "SELECT event_object_table, trigger_name FROM information_schema.triggers WHERE trigger_schema = 'public' AND event_object_table = ANY($1)",
    [targetTables]
  );
  if (triggers.rows.length === 0) {
    console.log('None');
  } else {
    triggers.rows.forEach(r => console.log(r.event_object_table + ': ' + r.trigger_name));
  }

  // Test insert + delete on discovered_businesses
  console.log('\n=== TEST INSERT ===');
  try {
    const ins = await client.query(
      "INSERT INTO discovered_businesses (name, region, status) VALUES ('__test_cascade__', 'test', 'pending') RETURNING id"
    );
    const testId = ins.rows[0].id;
    console.log('Insert OK, id: ' + testId);
    await client.query("DELETE FROM discovered_businesses WHERE id = $1", [testId]);
    console.log('Delete OK');
  } catch (e) {
    console.log('Insert FAILED: ' + e.message);
  }

  await client.end();
  console.log('\nDone.');
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
