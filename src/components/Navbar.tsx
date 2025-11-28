'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [logo, setLogo] = useState('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA3YmZmIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvZ288L3RleHQ+Cjwvc3ZnPgo=');

  useEffect(() => {
    // Cargar logo desde localStorage
    const loadLogo = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('siteContent');
        if (saved) {
          try {
            const content = JSON.parse(saved);
            if (content.logo) {
              setLogo(content.logo);
            }
          } catch (error) {
            console.error('Error parsing siteContent:', error);
          }
        }
      }
    };

    // Cargar inmediatamente
    loadLogo();

    // Escuchar cambios
    const handleContentUpdate = (event: CustomEvent) => {
      if (event.detail?.logo) {
        setLogo(event.detail.logo);
      }
    };

    window.addEventListener('siteContentUpdated', handleContentUpdate as EventListener);

    // También escuchar cambios en localStorage (por si se actualiza desde otra pestaña)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'siteContent') {
        loadLogo();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('siteContentUpdated', handleContentUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" href="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/tienda">
                Tienda
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