'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getSiteContent } from '@/lib/siteContent';

const Navbar = () => {
  const pathname = usePathname();
  const [logo, setLogo] = useState('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA3YmZmIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvZ288L3RleHQ+Cjwvc3ZnPgo=');

  useEffect(() => {
    // Cargar logo desde la API
    const loadLogo = async () => {
      try {
        const content = await getSiteContent();
        if (content?.logo) {
          setLogo(content.logo);
        }
      } catch (error) {
        console.error('Error loading logo:', error);
      }
    };

    // Cargar inmediatamente
    loadLogo();

    // Escuchar cambios en el contenido del sitio
    const handleContentUpdate = (event: CustomEvent) => {
      console.log('Navbar: Recibido evento siteContentUpdated', event.detail);
      if (event.detail?.logo) {
        console.log('Navbar: Actualizando logo a:', event.detail.logo);
        setLogo(event.detail.logo);
      }
    };

    window.addEventListener('siteContentUpdated', handleContentUpdate as EventListener);

    return () => {
      window.removeEventListener('siteContentUpdated', handleContentUpdate as EventListener);
    };
  }, []);

  console.log('Navbar: Renderizando con logo:', logo?.substring(0, 50) + '...');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" href="/" suppressHydrationWarning>
          {logo && (
            <img
              src={logo}
              alt="Arquitectura Pro"
              style={{ height: '40px', width: 'auto', marginRight: '10px' }}
              className="navbar-logo"
              onError={(e) => {
                console.error('Navbar: Error cargando logo', e);
                console.error('Navbar: URL del logo:', logo);
                console.error('Navbar: Longitud del logo:', logo?.length);
              }}
            />
          )}
          Arquitectura Pro
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Botón de navegación condicional */}
          <div className="d-flex me-3">
            {pathname === '/tienda' ? (
              <Link href="/" className="btn btn-primary">
                ← Volver al Inicio
              </Link>
            ) : pathname === '/' ? (
              <Link href="/tienda" className="btn btn-primary">
                Ver Catálogo
              </Link>
            ) : null}
          </div>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" href="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/tienda">
                Catálogo
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/blog">
                Blog
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;