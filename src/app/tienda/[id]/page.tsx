'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { notFound } from 'next/navigation';
import { getProducts, Product } from '@/lib/products';
import { getSiteContent } from '@/lib/siteContent';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetail({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('571234567890'); // fallback

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    // Cargar número de WhatsApp
    const loadWhatsAppNumber = async () => {
      try {
        const content = await getSiteContent();
        if (content?.whatsapp) {
          setWhatsappNumber(content.whatsapp.replace(/\D/g, ''));
        }
      } catch (error) {
        console.error('Error loading WhatsApp number in ProductDetail:', error);
      }
    };

    loadWhatsAppNumber();

    // Escuchar cambios en el contenido del sitio
    const handleContentUpdate = (event: CustomEvent) => {
      const content = event.detail;
      if (content.whatsapp) {
        setWhatsappNumber(content.whatsapp.replace(/\D/g, ''));
      }
    };

    window.addEventListener('siteContentUpdated', handleContentUpdate as EventListener);

    return () => {
      window.removeEventListener('siteContentUpdated', handleContentUpdate as EventListener);
    };
  }, []);

  const loadProduct = async () => {
    try {
      const products = await getProducts();
      const foundProduct = products.find(p => p.id === id);
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
  }, [id]);

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
        <div className="mb-4">
          <Link href="/tienda" className="btn btn-outline-primary">
            ← Volver al Catálogo
          </Link>
        </div>
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

            <button
              className="btn btn-success btn-lg"
              onClick={() => {
                const message = `Hola, estoy interesado en solicitar una cotización para: ${product.name}`;
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
            >
              📱 Solicitar Cotización
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}