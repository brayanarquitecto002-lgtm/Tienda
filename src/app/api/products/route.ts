import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/db';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        product_features (
          feature
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Process features
    const processedProducts = products?.map((product) => ({
      ...product,
      features: product.product_features?.map((pf: any) => pf.feature) || []
    })) || [];

    return NextResponse.json({
      success: true,
      products: processedProducts
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({
      success: false,
      message: `Error al cargar productos: ${(error as Error).message}`
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    const { name, description, price, image, details, features } = body;

    // Insert product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([{
        name,
        description,
        price,
        image,
        details
      }])
      .select()
      .single();

    if (productError) throw productError;

    // Insert features if provided
    if (features && Array.isArray(features) && features.length > 0) {
      const featureInserts = features.map(feature => ({
        product_id: product.id,
        feature
      }));

      const { error: featureError } = await supabase
        .from('product_features')
        .insert(featureInserts);

      if (featureError) throw featureError;
    }

    return NextResponse.json({
      success: true,
      productId: product.id,
      message: 'Producto agregado exitosamente'
    });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({
      success: false,
      message: `Error al agregar producto: ${(error as Error).message}`
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    const { id, name, description, price, image, details, features } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID del producto es requerido'
      }, { status: 400 });
    }

    // Update product
    const { error: productError } = await supabase
      .from('products')
      .update({
        name,
        description,
        price,
        image,
        details
      })
      .eq('id', id);

    if (productError) throw productError;

    // Delete existing features
    const { error: deleteError } = await supabase
      .from('product_features')
      .delete()
      .eq('product_id', id);

    if (deleteError) throw deleteError;

    // Insert new features if provided
    if (features && Array.isArray(features) && features.length > 0) {
      const featureInserts = features.map(feature => ({
        product_id: id,
        feature
      }));

      const { error: featureError } = await supabase
        .from('product_features')
        .insert(featureInserts);

      if (featureError) throw featureError;
    }

    return NextResponse.json({
      success: true,
      message: 'Producto actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({
      success: false,
      message: `Error al actualizar producto: ${(error as Error).message}`
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID del producto es requerido'
      }, { status: 400 });
    }

    // Delete product (features will be deleted automatically due to CASCADE)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({
      success: false,
      message: `Error al eliminar producto: ${(error as Error).message}`
    }, { status: 500 });
  }
}