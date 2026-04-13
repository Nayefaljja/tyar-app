/**
 * TYAR — Supabase client (web)
 * Loaded via <script> tag in all pages.
 */

const SUPABASE_URL  = 'https://gfqafbubvdrpjgimtert.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmcWFmYnVidmRycGpnaW10ZXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NTQzMDYsImV4cCI6MjA4ODQzMDMwNn0.v0VCl4BHt28MCHqd0cHiFeVDCv-2i0VL65QPUx4VK70';

// Initialised once the Supabase CDN script has loaded
let _db = null;
function db() {
  if (!_db) {
    _db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  }
  return _db;
}

// ── Cars ────────────────────────────────────────────────────────────────────
async function fetchCars() {
  const { data, error } = await db()
    .from('cars')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ── Charger booking ─────────────────────────────────────────────────────────
async function submitChargerBooking(payload) {
  const { data, error } = await db()
    .from('charger_bookings')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Maintenance booking ──────────────────────────────────────────────────────
async function submitMaintenanceBooking(payload) {
  const { data, error } = await db()
    .from('maintenance_bookings')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

window.tyarDB = { fetchCars, submitChargerBooking, submitMaintenanceBooking };
