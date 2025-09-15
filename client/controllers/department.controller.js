import { supabase } from '../config/supabase';

export const getAllDepartments = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
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

export const getDepartmentMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    
    let query = supabase
      .from('event_media')
      .select('*')
      .eq('department_id', id)
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    
    if (type && ['photo', 'video', 'poster', 'document'].includes(type)) {
      query = query.eq('media_type', type);
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

export const getDepartmentEvents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    
    let query = supabase
      .from('events')
      .select('*')
      .eq('department_id', id)
      .order('date', { ascending: false });
    
    if (status && ['upcoming', 'ongoing', 'completed'].includes(status)) {
      query = query.eq('status', status);
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