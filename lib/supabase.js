import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://tastahllxtzsvfitmekk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhc3RhaGxseHR6c3ZmaXRtZWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NjA1OTksImV4cCI6MjEwMzEzNjU5OX0.fr844JzpGEzR0ABfGm7puTHUK2xndXZrVU8XVG_oiCM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
