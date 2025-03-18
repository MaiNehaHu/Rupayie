import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://spavlbfvobflgsodopek.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwYXZsYmZ2b2JmbGdzb2RvcGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNzE4ODEsImV4cCI6MjA1Nzg0Nzg4MX0.RF8oesx647B5eYBdXPxhnAGa3hKNMlh9Qbobw-9MM78";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
