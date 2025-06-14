import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL="https://mdrsogsmrsqrytrhaegd.supabase.co"
const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcnNvZ3NtcnNxcnl0cmhhZWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY3MDkyMTMsImV4cCI6MjAzMjI4NTIxM30.U9JwVIkUKxzYnu9MDLHAth6xHTcHWPt8nbXtFHNaFA0"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)