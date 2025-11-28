'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { getProducts, addProduct } from '@/lib/products';

export default function AdminTest() {
  const [connectionStatus, setConnectionStatus] = useState<string>('No probado');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      // Test Supabase connection by trying to fetch site content
      const response = await fetch('/api/site-content');
      const data = await response.json();

      if (data.success) {
        setConnectionStatus('✅ Conectado correctamente a Supabase (PostgreSQL)');
      } else {
        setConnectionStatus('❌ Error: ' + data.message);
      }
    } catch (error) {
      setConnectionStatus('❌ Error de conexión a Supabase: ' + (error as Error).message);
    }
    setLoading(false);
  };

  const handleLoadProducts = async () => {
    setLoading(true);
    try {
      const loadedProducts = await getProducts();
      setProducts(loadedProducts);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setProducts([]);
    }
    setLoading(false);
  };

  const handleAddTestProduct = async () => {
    setLoading(true);
    try {
      const testProduct = {
        name: 'Producto de Prueba ' + Date.now(),
        description: 'Este es un producto de prueba para verificar la conexión a la base de datos.',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiM2Yzc1N2QiLz48dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvZHVjdG8gZGUgUHJ1ZWJhPC90ZXh0Pjwvc3ZnPgo=',
        price: 'Desde $100.000',
        details: 'Producto de prueba generado automáticamente',
        features: ['Prueba', 'Conexión', 'Base de datos'],
      };

      const productId = await addProduct(testProduct);
      if (productId) {
        alert('✅ Producto agregado exitosamente con ID: ' + productId);
        handleLoadProducts(); // Recargar lista
      } else {
        alert('❌ Error al agregar producto');
      }
    } catch (error) {
      console.error('Error agregando producto:', error);
      alert('❌ Error: ' + (error as Error).message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>🧪 Pruebas de Conexión a Supabase (PostgreSQL)</h1>
          <Link href="/admin" className="btn btn-secondary">
            ← Volver al Panel
          </Link>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                <h5>🔗 Prueba de Conexión Supabase</h5>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Estado: <strong>{connectionStatus}</strong>
                </p>
                <button
                  className="btn btn-primary"
                  onClick={handleTestConnection}
                  disabled={loading}
                >
                  {loading ? '🔄 Probando...' : '🧪 Probar Conexión'}
                </button>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h5>📦 Gestionar Productos</h5>
              </div>
              <div className="card-body">
                <button
                  className="btn btn-info me-2"
                  onClick={handleLoadProducts}
                  disabled={loading}
                >
                  📋 Cargar Productos
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleAddTestProduct}
                  disabled={loading}
                >
                  ➕ Agregar Producto de Prueba
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5>📊 Productos en Supabase</h5>
              </div>
              <div className="card-body">
                {products.length === 0 ? (
                  <p className="text-muted">No hay productos cargados</p>
                ) : (
                  <div className="list-group">
                    {products.map((product, index) => (
                      <div key={product.id || index} className="list-group-item">
                        <h6>{product.name}</h6>
                        <small className="text-muted">{product.price}</small>
                        <br />
                        <small>ID: {product.id}</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="alert alert-info mt-4">
          <h6>🔍 Cómo verificar si funciona:</h6>
          <ol>
            <li>Haz click en "Probar Conexión" - debería decir "Conectado correctamente a Supabase"</li>
            <li>Haz click en "Cargar Productos" - deberías ver productos si hay datos</li>
            <li>Haz click en "Agregar Producto de Prueba" - debería agregar un producto</li>
            <li>Si todo funciona, Supabase está conectado correctamente</li>
          </ol>
        </div>

        <div className="alert alert-warning">
          <strong>💡 Consejos de depuración:</strong>
          <ul className="mb-0 mt-2">
            <li>Abre la consola del navegador (F12) para ver los logs detallados</li>
            <li>Si hay errores de conexión, verifica que las variables de entorno estén configuradas</li>
            <li>Revisa que las tablas se hayan creado en Supabase (SQL Editor)</li>
            <li>Los productos se guardan permanentemente en Supabase (PostgreSQL)</li>
            <li>Supabase es gratis: 500MB storage, sin costo por requests</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}