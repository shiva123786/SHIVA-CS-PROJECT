import { supabase } from '../config/supabase';

export const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, time, location, image_url, max_participants, status, registration_deadline, department_id } = req.body;
    
    const { data, error } = await supabase
      .from('events')
      .insert([{
        title,
        description,
        date,
        time,
        location,
        image_url: image_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600',
        max_participants,
        status,
        registration_deadline,
        department_id,
        created_by: req.user.id
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

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const eventData = req.body;
    
    const { data, error } = await supabase
      .from('events')
      .update({
        ...eventData,
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

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEvents = async (req, res, next) => {
  try {
    const { status, department_id } = req.query;
    
    let query = supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });
    
    if (status && ['upcoming', 'ongoing', 'completed'].includes(status)) {
      query = query.eq('status', status);
    }
    
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

export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
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