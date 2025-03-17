import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://xwetufsmzwffrdxzchwv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZXR1ZnNtendmZnJkeHpjaHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxOTMzMjIsImV4cCI6MjA1Nzc2OTMyMn0.vVIpJWpNvuOtgy16HQ71Yz-hscCz_kO7BOnGj7h7CnM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
