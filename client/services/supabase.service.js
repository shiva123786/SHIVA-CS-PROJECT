import { supabase } from '../config/supabase';

export const getDepartmentsWithAdmins = async () => {
  const { data, error } = await supabase
    .from('departments')
    .select(`
      *,
      department_admins (
        user_id,
        users (
          id,
          email,
          full_name
        )
      )
    `);
  
  if (error) throw error;
  return data;
};

export const getDepartmentAdmins = async (departmentId) => {
  const { data, error } = await supabase
    .from('department_admins')
    .select(`
      user_id,
      users (
        id,
        email,
        full_name,
        phone
      )
    `)
    .eq('department_id', departmentId)
    .eq('is_active', true);
  
  if (error) throw error;
  return data;
};

export const getEventWithMedia = async (eventId) => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      event_media (
        id,
        title,
        media_type,
        media_url,
        created_at
      )
    `)
    .eq('id', eventId)
    .single();
  
  if (error) throw error;
  return data;
};

export const getStats = async () => {
  const [
    { count: totalEvents },
    { count: upcomingEvents },
    { count: totalRegistrations },
    { count: pendingRegistrations }
  ] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact' }),
    supabase.from('events').select('*', { count: 'exact' }).eq('status', 'upcoming'),
    supabase.from('registrations').select('*', { count: 'exact' }),
    supabase.from('registrations').select('*', { count: 'exact' }).eq('status', 'pending')
  ]);
  
  return {
    totalEvents,
    upcomingEvents,
    totalRegistrations,
    pendingRegistrations
  };
};