'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Product } from '@/lib/products';
import { getSiteContent } from '@/lib/siteContent';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [whatsappNumber, setWhatsappNumber] = useState('571234567890'); // fallback

  // Si no hay imagen, usar imagen por defecto
  const imageUrl = product.image || `https://picsum.photos/400/300?random=999`;

  useEffect(() => {
    // Cargar número de WhatsApp
    const loadWhatsAppNumber = async () => {
      try {
        const content = await getSiteContent();
        if (content?.whatsapp) {
          setWhatsappNumber(content.whatsapp.replace(/\D/g, ''));
        }
      } catch (error) {
        console.error('Error loading WhatsApp number in ProductCard:', error);
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

  useEffect(() => {
    // Timeout más largo para imágenes base64 (10 segundos máximo)
    const timeout = setTimeout(() => {
      if (imageState === 'loading') {
        setImageState('error');
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [imageState]);

  return (
    <div className="card h-100 shadow-sm">
      <div
        className="card-img-top d-flex align-items-center justify-content-center bg-light"
        style={{ height: '200px', position: 'relative' }}
      >
        {imageState === 'loading' && (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        )}
        {imageState === 'error' ? (
          <div className="text-center text-muted">
            <i className="fas fa-image fa-2x mb-2"></i>
            <br />
            <small>Imagen no disponible</small>
          </div>
        ) : (
          <img
            src={imageUrl}
            className={`card-img-top ${imageState === 'loaded' ? '' : 'd-none'}`}
            alt={product.name}
            style={{
              height: '200px',
              objectFit: 'cover',
              width: '100%'
            }}
            loading="lazy"
            onLoad={() => setImageState('loaded')}
            onError={() => setImageState('error')}
          />
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text flex-grow-1">{product.description}</p>
        <p className="fw-bold text-primary">{product.price}</p>
        <div className="d-flex gap-2 mt-auto">
          <Link href={`/tienda/${product.id}`} className="btn btn-primary flex-fill">
            Ver Detalles
          </Link>
          <button
            className="btn btn-success flex-fill"
            onClick={() => {
              const message = `Hola, estoy interesado en el producto: ${product.name}`;
              const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
          >
            Contactar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;