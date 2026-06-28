"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePassword(password: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
