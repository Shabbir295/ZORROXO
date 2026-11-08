import { createClient } from '@supabase/supabase-js';

// 🔥 Sahi URL aur Key
const supabaseUrl = 'https://xnirhvlovfnzlfxxhxvl.supabase.co';
const supabaseAnonKey = 'sb_publishable_IqviGfa82C_l0M1NVw4qtQ_ReVYbwMX';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);