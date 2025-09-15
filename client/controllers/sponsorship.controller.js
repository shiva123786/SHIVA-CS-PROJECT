import { supabase } from '../config/supabase';

export const createSponsorshipInquiry = async (req, res, next) => {
  try {
    const {
      company_name,
      contact_person,
      email,
      phone,
      website,
      sponsorship_type,
      budget,
      message,
      interests
    } = req.body;
    
    const { data, error } = await supabase
      .from('sponsorship_inquiries')
      .insert([{
        company_name,
        contact_person,
        email,
        phone,
        website,
        sponsorship_type,
        budget,
        message,
        interests: interests || []
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

export const updateSponsorshipStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['contacted', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const { data, error } = await supabase
      .from('sponsorship_inquiries')
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

export const getAllSponsorshipInquiries = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = supabase
      .from('sponsorship_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status && ['pending', 'contacted', 'approved', 'rejected'].includes(status)) {
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

export const getSponsorshipInquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('sponsorship_inquiries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
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