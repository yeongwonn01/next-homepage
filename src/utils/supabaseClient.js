import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xzymffccmhwrxczxlnfs.supabase.co"; // Supabase 프로젝트 URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6eW1mZmNjbWh3cnhjenhsbmZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwODE1NDIsImV4cCI6MjA1MzY1NzU0Mn0.xOiYYCqCTZvyQ5MRxcSN6CxmZ0SFXFuloE3ojt1x7U4"; // Supabase API Key

export const supabase = createClient(supabaseUrl, supabaseKey);
