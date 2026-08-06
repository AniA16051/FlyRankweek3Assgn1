const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your_anon_key';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
