import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Función para probar conexión
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('site_content').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Conexión a Supabase exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a Supabase:', error);
    return false;
  }
}