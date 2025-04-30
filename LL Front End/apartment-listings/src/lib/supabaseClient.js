import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rhhghpaggqbjrciikpbm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaGdocGFnZ3FianJjaWlrcGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NDg5NjEsImV4cCI6MjA2MTQyNDk2MX0.xTfs8aAV6iJgcbDFKzqIDDmK1Nc7APA_HlI3TnDgwNM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);