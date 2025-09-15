import app from './app';
import { supabase } from './config/supabase';

const PORT = process.env.PORT || 5000;

// Test Supabase connection
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ Connected to Supabase successfully');
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:', error.message);
    process.exit(1);
  }
}

// Start server
app.listen(PORT, async () => {
  await testSupabaseConnection();
  console.log(`Server running on port ${PORT}`);
});