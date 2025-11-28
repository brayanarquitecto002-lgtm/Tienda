'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [logo, setLogo] = useState('https://picsum.photos/200/80?random=1');

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