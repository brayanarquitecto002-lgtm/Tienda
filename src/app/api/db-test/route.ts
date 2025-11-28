import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

export async function GET() {
  try {
    const isConnected = await testConnection();
    return NextResponse.json({
      success: true,
      connected: isConnected,
      message: isConnected ? 'Conectado correctamente a MySQL' : 'Error de conexión'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      connected: false,
      message: `Error: ${(error as Error).message}`
    }, { status: 500 });
  }
}