import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = 'https://gfqafbubvdrpjgimtert.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmcWFmYnVidmRycGpnaW10ZXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NTQzMDYsImV4cCI6MjA4ODQzMDMwNn0.v0VCl4BHt28MCHqd0cHiFeVDCv-2i0VL65QPUx4VK70';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Cars ────────────────────────────────────────────────────────────────────
export async function fetchCars() {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ── Charger booking ─────────────────────────────────────────────────────────
export async function submitChargerBooking({ name, phone, city, chargerType, chargerPower, estimatedPrice, notes }) {
  const { data, error } = await supabase
    .from('charger_bookings')
    .insert([{
      name,
      phone,
      city,
      charger_type:    chargerType,
      charger_power:   chargerPower,
      estimated_price: estimatedPrice,
      notes:           notes || null,
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Maintenance booking ──────────────────────────────────────────────────────
export async function submitMaintenanceBooking({ serviceType, carModel, carYear, preferredDate, timeSlot, city, notes, estimatedCost }) {
  const { data, error } = await supabase
    .from('maintenance_bookings')
    .insert([{
      service_type:   serviceType,
      car_model:      carModel,
      car_year:       carYear,
      preferred_date: preferredDate,
      time_slot:      timeSlot,
      city,
      notes:          notes || null,
      estimated_cost: estimatedCost,
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}
