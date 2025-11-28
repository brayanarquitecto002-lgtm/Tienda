'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { getSiteContent, SiteContent } from '@/lib/siteContent';


export default function Home() {
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    // Intentar cargar desde localStorage primero para evitar delay
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('siteContent');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return {
      heroTitle: 'Arquitectura Pro',
      heroDescription: 'Diseños arquitectónicos innovadores y sostenibles para transformar tus espacios.',
      aboutUs: 'Somos un equipo de arquitectos apasionados por crear espacios funcionales, estéticos y sostenibles. Con años de experiencia, hemos diseñado proyectos residenciales, comerciales e institucionales.',
      mission: 'Nuestra misión es proporcionar soluciones arquitectónicas de alta calidad que mejoren la calidad de vida de nuestros clientes, integrando innovación, sostenibilidad y funcionalidad en cada proyecto.',
      vision: 'Ser líderes en el diseño arquitectónico, reconocidos por nuestra excelencia, creatividad y compromiso con el desarrollo urbano sostenible.',
      logo: 'https://via.placeholder.com/200x80/007bff/ffffff?text=LOGO',
      heroImage: 'https://via.placeholder.com/1200x600/6c757d/ffffff?text=Imagen+Hero',
      socialLinks: {
        facebook: '',
        instagram: '',
        gmail: '',
        youtube: '',
        tiktok: '',
      },
      whatsapp: '',
    };
  });

  useEffect(() => {
    // Cargar desde Firebase y actualizar si es diferente
    const loadFromFirebase = async () => {
      try {
        const content = await getSiteContent();
        if (content) {
          setSiteContent(content);
          localStorage.setItem('siteContent', JSON.stringify(content));
        }
      } catch (error) {
        console.error('Error loading site content from Firebase:', error);
      }
    };

    loadFromFirebase();
  }, []);

  useEffect(() => {
    // Escuchar cambios en el contenido del sitio
    const handleContentUpdate = (event: CustomEvent) => {
      setSiteContent(event.detail);
    };

    window.addEventListener('siteContentUpdated', handleContentUpdate as EventListener);

    return () => {
      window.removeEventListener('siteContentUpdated', handleContentUpdate as EventListener);
    };
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold">{siteContent.heroTitle}</h1>
              <p className="lead">
                {siteContent.heroDescription}
              </p>
              <a href="/tienda" className="btn btn-light btn-lg">
                Ver Catálogo
              </a>
            </div>
            <div className="col-md-6">
              <img
                src={siteContent.heroImage || 'https://via.placeholder.com/1200x600/6c757d/ffffff?text=Imagen+Hero'}
                alt="Arquitectura"
                className="img-fluid rounded"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Quiénes Somos</h2>
          <p className="text-center lead">
            {siteContent.aboutUs}
          </p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h3>Misión</h3>
              <p>
                {siteContent.mission}
              </p>
            </div>
            <div className="col-md-6">
              <h3>Visión</h3>
              <p>
                {siteContent.vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Redes Sociales */}
      {siteContent.socialLinks && Object.values(siteContent.socialLinks).some(link => link.trim() !== '') && (
        <section className="py-4 bg-white">
          <div className="container">
            <div className="text-center">
              <h4 className="mb-4">Síguenos en Redes Sociales</h4>
              <div className="d-flex justify-content-center gap-3">
                {siteContent.socialLinks && Object.entries(siteContent.socialLinks).map(([platform, link]) => {
                  if (!link.trim()) return null;

                  const socialIcons = {
                    facebook: (
                      <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    ),
                    instagram: (
                      <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C8.396 0 7.966.021 6.677.072 5.393.124 4.434.265 3.633.515c-.806.247-1.488.578-2.17 1.26C.783 2.457.452 3.139.205 3.945.07 4.746-.021 5.705-.021 7.99c0 3.621.021 4.051.072 5.34.053 1.284.194 2.243.444 3.044.247.806.578 1.488 1.26 2.17.672.672 1.354 1.003 2.16 1.25.801.25 1.76.391 3.044.444 1.289.05 1.719.072 5.34.072s4.051-.022 5.34-.072c1.284-.053 2.243-.194 3.044-.444.806-.247 1.488-.578 2.17-1.26.672-.672 1.003-1.354 1.25-2.16.25-.801.391-1.76.444-3.044.05-1.289.072-1.719.072-5.34s-.022-4.051-.072-5.34c-.053-1.284-.194-2.243-.444-3.044-.247-.806-.578-1.488-1.26-2.17-.672-.672-1.354-1.003-2.16-1.25-.801-.25-1.76-.391-3.044-.444C16.051.021 15.621 0 12.017 0zm0 2.163c3.574 0 4.005.014 5.417.064 1.301.047 2.03.218 2.51.365.528.161.907.353 1.302.748.395.395.587.774.748 1.302.147.48.318 1.209.365 2.51.05 1.412.064 1.843.064 5.417s-.014 4.005-.064 5.417c-.047 1.301-.218 2.03-.365 2.51-.161.528-.353.907-.748 1.302-.395.395-.774.587-1.302.748-.48.147-1.209.318-2.51.365-1.412.05-1.843.064-5.417.064s-4.005-.014-5.417-.064c-1.301-.047-2.03-.218-2.51-.365-.528-.161-.907-.353-1.302-.748-.395-.395-.587-.774-.748-1.302-.147-.48-.318-1.209-.365-2.51-.05-1.412-.064-1.843-.064-5.417s.014-4.005.064-5.417c.047-1.301.218-2.03.365-2.51.161-.528.353-.907.748-1.302.395-.395.774-.587 1.302-.748.48-.147 1.209-.318 2.51-.365 1.412-.05 1.843-.064 5.417-.064zm0 3.789c-3.704 0-6.71 3.006-6.71 6.71s3.006 6.71 6.71 6.71 6.71-3.006 6.71-6.71-3.006-6.71-6.71-6.71zm0 11.077c-2.407 0-4.357-1.95-4.357-4.357s1.95-4.357 4.357-4.357 4.357 1.95 4.357 4.357-1.95 4.357-4.357 4.357zm8.477-11.182c-.917 0-1.661.744-1.661 1.661s.744 1.661 1.661 1.661 1.661-.744 1.661-1.661-.744-1.661-1.661-1.661z"/>
                      </svg>
                    ),
                    gmail: (
                      <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.545c.583 0 1.298.258 1.807.748l6.712 5.344 6.712-5.344c.51-.49 1.224-.748 1.807-.748h.545c.904 0 1.636.732 1.636 1.636z"/>
                      </svg>
                    ),
                    youtube: (
                      <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    ),
                    tiktok: (
                      <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    ),
                  };

                  const getLink = (platform: string, link: string) => {
                    if (platform === 'gmail') {
                      return `mailto:${link}`;
                    }
                    return link;
                  };

                  return (
                    <a
                      key={platform}
                      href={getLink(platform, link)}
                      target={platform === 'gmail' ? '_self' : '_blank'}
                      rel={platform === 'gmail' ? '' : 'noopener noreferrer'}
                      className="text-decoration-none"
                      title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    >
                      <div className="d-flex align-items-center justify-content-center bg-light rounded-circle"
                           style={{ width: '50px', height: '50px' }}>
                        {socialIcons[platform as keyof typeof socialIcons]}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
