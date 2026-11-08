import { createClient } from '@supabase/supabase-js';

// 🔥 Direct Keys (Vercel ki tension khatam)
const supabaseUrl = 'https://xnirhvlovfnzlfxhxvl.supabase.co';
const supabaseAnonKey = 'sb_publishable_IqviGfa82C_l0M1NVw4qtQ_ReVYbwMX';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);