import { SupabaseClient } from "@supabase/supabase-js";

export const upload_to_bucket = async (
  file: File,
  supabase: SupabaseClient
) => {
  if (!file) {
    console.error("No file selected");
    return;
  }

  // Upload the file to Supabase storage
  const { data, error } = await supabase.storage
    .from("gdrive") // Replace with your storage bucket name
    .upload(`folder/${file.name}`, file);

  if (error) {
    console.error("Error uploading file:", error.message);
  }

  return data;
};

export const delete_from_bucket = async (
  fileName: string,
  supabase: SupabaseClient
) => {
  const filePath = `folder/${fileName}`;
  const { error } = await supabase.storage.from("gdrive").remove([filePath]);
  console.log(error);
};
