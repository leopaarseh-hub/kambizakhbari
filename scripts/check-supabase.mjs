// Quick connectivity and schema check for the Supabase backend.
// Usage: node scripts/check-supabase.mjs
// Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from the
// environment (load .env.local first, see the npm script "check:supabase").

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('\n  Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  console.error('  Fill them in .env.local, then run again.\n');
  process.exit(1);
}

const supabase = createClient(url, key);
const tables = ['classes', 'events', 'registrations', 'contact_messages', 'settings'];

let ok = true;
console.log(`\n  Connecting to ${url} ...\n`);

for (const table of tables) {
  const { error, count } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });

  if (error) {
    ok = false;
    // A "permission denied" on registrations/messages from the anon key is
    // expected and healthy: it means RLS is protecting private data.
    const expectedRls =
      (table === 'registrations' || table === 'contact_messages') &&
      /permission|row-level|denied/i.test(error.message);
    if (expectedRls) {
      console.log(`  [ok]   ${table.padEnd(18)} protected by RLS (as expected)`);
      ok = true;
    } else {
      console.log(`  [FAIL] ${table.padEnd(18)} ${error.message}`);
    }
  } else {
    console.log(`  [ok]   ${table.padEnd(18)} reachable (${count ?? 0} rows)`);
  }
}

// Verify the public storage bucket exists.
const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
if (bucketErr) {
  console.log(`  [warn] storage           could not list buckets: ${bucketErr.message}`);
} else if (buckets?.some((b) => b.name === 'media')) {
  console.log(`  [ok]   storage:media     public bucket present`);
} else {
  ok = false;
  console.log(`  [FAIL] storage:media     bucket missing (run the migration)`);
}

console.log(
  ok
    ? '\n  All good. The site is connected to Supabase.\n'
    : '\n  Some checks failed. Run supabase/migrations/0001_schema.sql in the SQL editor.\n',
);
process.exit(ok ? 0 : 1);
