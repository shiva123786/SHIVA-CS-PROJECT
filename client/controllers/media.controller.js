import { supabase } from '../config/supabase';
import { uploadFile } from '../services/storage.service';

export const uploadMedia = async (req, res, next) => {
  try {
    const { title, description, media_type, department_id, event_id, is_featured, is_public, tags } = req.body;
    const file = req.file;
    
    let media_url = req.body.media_url;
    
    if (file) {
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await uploadFile(
        `departments/${department_id}/${media_type}s/${file.originalname}`,
        file.buffer,
        file.mimetype
      );
      
      if (uploadError) throw uploadError;
      media_url = uploadData.path;
    }
    
    if (!media_url) {
      return res.status(400).json({
        success: false,
        message: 'Media URL or file is required'
      });
    }
    
    const { data, error } = await supabase
      .from('event_media')
      .insert([{
        title,
        description,
        media_type,
        media_url,
        department_id,
        event_id: event_id || null,
        uploaded_by: req.user.id,
        is_featured: is_featured || false,
        is_public: is_public !== false,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : []
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const updateMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, media_type, department_id, event_id, is_featured, is_public, tags } = req.body;
    const file = req.file;
    
    let media_url = req.body.media_url;
    
    if (file) {
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await uploadFile(
        `departments/${department_id}/${media_type}s/${file.originalname}`,
        file.buffer,
        file.mimetype
      );
      
      if (uploadError) throw uploadError;
      media_url = uploadData.path;
    }
    
    const { data, error } = await supabase
      .from('event_media')
      .update({
        title,
        description,
        media_type,
        media_url: media_url || undefined,
        department_id,
        event_id: event_id || null,
        is_featured,
        is_public,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('event_media')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getMediaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('event_media')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedMedia = async (req, res, next) => {
  try {
    const { department_id } = req.query;
    
    let query = supabase
      .from('event_media')
      .select('*')
      .eq('is_featured', true)
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    
    if (department_id) {
      query = query.eq('department_id', department_id);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};