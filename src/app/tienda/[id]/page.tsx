'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { notFound } from 'next/navigation';
import { getProducts, Product } from '@/lib/products';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetail({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      const products = await getProducts();
      const foundProduct = products.find(p => p.id === params.id);
      setProduct(foundProduct || null);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Escuchar cambios en los productos
    const handleProductsUpdate = () => {
      loadProduct();
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, [params.id]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <Layout>
      <div className="container py-5">
        <div className="row">
          <div className="col-md-6">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-md-6">
            <h1 className="mb-3">{product.name}</h1>
            <p className="lead mb-4">{product.description}</p>
            <h3 className="text-primary mb-3">{product.price}</h3>
            <p className="mb-4"><strong>Detalles:</strong> {product.details}</p>

            <h4>Características Principales:</h4>
            <ul className="list-group list-group-flush mb-4">
              {product.features.map((feature, index) => (
                <li key={index} className="list-group-item">{feature}</li>
              ))}
            </ul>

            <button className="btn btn-primary btn-lg me-2">Solicitar Cotización</button>
            <button className="btn btn-outline-secondary btn-lg">Descargar Plano</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}