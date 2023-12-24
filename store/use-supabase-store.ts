import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { create } from "zustand";

interface SupabaseStore {
  supabase: SupabaseClient | null;
  createSupabaseClient: (SUPABASE_URl: string, SUPABASE_KEY: string) => void;
}

export const useSupabase = create<SupabaseStore>((set) => ({
  supabase: null,
  createSupabaseClient: (SUPABASE_URL, SUPABASE_KEY) =>
    set({ supabase: createClient(SUPABASE_URL, SUPABASE_KEY) }),
}));
