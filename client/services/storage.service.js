import { supabase } from '../config/supabase';

export const uploadFile = async (path, fileBuffer, mimeType) => {
  const { data, error } = await supabase.storage
    .from('event-media') // Your Supabase storage bucket name
    .upload(path, fileBuffer, {
      contentType: mimeType,
      upsert: true
    });
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('event-media')
    .getPublicUrl(data.path);
  
  return {
    ...data,
    publicUrl
  };
};

export const deleteFile = async (path) => {
  const { data, error } = await supabase.storage
    .from('event-media')
    .remove([path]);
  
  if (error) throw error;
  return data;
};