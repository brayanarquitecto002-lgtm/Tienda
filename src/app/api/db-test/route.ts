import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/db';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    // Test connection by trying to select from site_content table
    const { data, error } = await supabase
      .from('site_content')
      .select('count')
      .limit(1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      connected: true,
      message: 'Conectado correctamente a Supabase (PostgreSQL)'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      connected: false,
      message: `Error de conexión a Supabase: ${(error as Error).message}`
    }, { status: 500 });
  }
}