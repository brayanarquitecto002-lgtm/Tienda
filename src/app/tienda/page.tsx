'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { getProducts, Product } from '@/lib/products';

export default function Tienda() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // TEMPORAL: Leer desde localStorage mientras Firebase se configura
      console.log('🔍 Intentando cargar productos desde localStorage...');
      const saved = localStorage.getItem('products');
      console.log('📦 Contenido de localStorage "products":', saved);

      if (saved) {
        try {
          const productsData = JSON.parse(saved);
          console.log('✅ Productos cargados desde localStorage:', productsData.length);
          console.log('📋 Productos:', productsData.map((p: any) => ({ id: p.id, name: p.name, image: p.image?.substring(0, 50) + '...' })));
          setProducts(productsData);
        } catch (parseError) {
          console.error('❌ Error parseando productos de localStorage:', parseError);
          const productsData = await getProducts();
          setProducts(productsData);
        }
      } else {
        console.log('📝 No hay productos guardados en localStorage, mostrando productos de ejemplo...');
        // Si no hay productos guardados, intentar desde Firebase
        const productsData = await getProducts();
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Error al cargar los productos. Intenta recargar la página.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Escuchar cambios en los productos
    const handleProductsUpdate = () => {
      loadProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, []);
  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando catálogo...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="alert alert-danger text-center" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Recargar Página
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-5">
        <h1 className="text-center mb-4">Catálogo de Diseños Arquitectónicos</h1>
        <p className="text-center lead mb-5">
          Explora nuestros diseños innovadores y encuentra la inspiración para tu próximo proyecto.
        </p>

        {products.length === 0 ? (
          <div className="text-center">
            <div className="alert alert-info" role="alert">
              <h4>No hay productos disponibles</h4>
              <p>Los productos se agregarán próximamente desde el panel de administración.</p>
            </div>
          </div>
        ) : (
          <div className="row">
            {products.map((product) => (
              <div key={product.id} className="col-md-6 col-lg-3 mb-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}