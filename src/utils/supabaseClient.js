
import { createClient } from '@supabase/supabase-js'
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Service Key missing in .env');
}
const supabase = createClient(supabaseUrl, supabaseKey)
// console.log("Supabase client initialized", supabase);

export { supabase }