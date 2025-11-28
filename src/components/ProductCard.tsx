'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    // Timeout para evitar spinner infinito (5 segundos máximo)
    const timeout = setTimeout(() => {
      if (imageState === 'loading') {
        setImageState('error');
      }
    }, 5000);

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
            src={product.image}
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
        <Link href={`/tienda/${product.id}`} className="btn btn-primary mt-auto">
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;