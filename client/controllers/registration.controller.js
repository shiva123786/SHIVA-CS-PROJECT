import { supabase } from '../config/supabase';

export const createRegistration = async (req, res, next) => {
  try {
    const {
      full_name,
      email,
      phone,
      age,
      city,
      talent_category,
      experience,
      motivation,
      previous_events,
      social_media,
      emergency_contact,
      emergency_phone
    } = req.body;
    
    const { data, error } = await supabase
      .from('registrations')
      .insert([{
        full_name,
        email,
        phone,
        age,
        city,
        talent_category,
        experience,
        motivation,
        previous_events,
        social_media,
        emergency_contact,
        emergency_phone
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

export const updateRegistrationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const { data, error } = await supabase
      .from('registrations')
      .update({
        status
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

export const getAllRegistrations = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
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

export const getRegistrationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
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