// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gtgdrilvmuxldohurabk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0Z2RyaWx2bXV4bGRvaHVyYWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NjIxMjksImV4cCI6MjA2NTEzODEyOX0.J9cyJrZCs7h-eQNSf_wPxM4sUSjxT_i8FgiSccgJFhA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);