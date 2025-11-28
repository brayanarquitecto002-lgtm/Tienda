'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { getSiteContent, saveSiteContent, uploadLogo, SiteContent } from '@/lib/siteContent';

export default function AdminHome() {
  const [siteContent, setSiteContent] = useState<SiteContent>({
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
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadSiteContent();
  }, []);

  const loadSiteContent = async () => {
    try {
      const content = await getSiteContent();
      if (content) {
        setSiteContent(content);
      }
    } catch (error) {
      console.error('Error loading site content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSiteContent(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setSiteContent(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };


  const handleLogoUpload = async (file: File) => {
    // Validar tamaño antes de subir (máximo 2MB para logos)
    if (file.size > 2 * 1024 * 1024) {
      alert('El logo es demasiado grande. Máximo 2MB.');
      return;
    }

    setUploading(true);
    try {
      const logoUrl = await uploadLogo(file);
      if (logoUrl) {
        setSiteContent(prev => ({ ...prev, logo: logoUrl }));
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Error al subir el logo');
    } finally {
      setUploading(false);
    }
  };

  const handleHeroImageUpload = async (file: File) => {
    // Validar tamaño antes de subir (máximo 3MB para hero)
    if (file.size > 3 * 1024 * 1024) {
      alert('La imagen del hero es demasiado grande. Máximo 3MB.');
      return;
    }

    setUploading(true);
    try {
      // Comprimir imagen del hero (máximo 1200px de ancho)
      const compressedFile = await new Promise<File>((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const img = new Image();

        img.onload = () => {
          let { width, height } = img;
          const maxWidth = 1200;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.85);
        };

        img.src = URL.createObjectURL(file);
      });

      const heroImageUrl = await uploadLogo(compressedFile); // Reutilizamos la función de upload
      if (heroImageUrl) {
        setSiteContent(prev => ({ ...prev, heroImage: heroImageUrl }));
      }
    } catch (error) {
      console.error('Error uploading hero image:', error);
      alert('Error al subir la imagen del hero');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const success = await saveSiteContent(siteContent);
      if (success) {
        // Disparar evento personalizado para actualizar otras páginas
        window.dispatchEvent(new CustomEvent('siteContentUpdated', { detail: siteContent }));
        alert('Contenido guardado exitosamente. Los cambios se reflejarán automáticamente.');
      } else {
        alert('Error al guardar el contenido');
      }
    } catch (error) {
      console.error('Error saving site content:', error);
      alert('Error al guardar el contenido');
    }
  };

  return (
    <Layout>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Editar Página Home</h1>
          <Link href="/admin" className="btn btn-secondary">
            ← Volver al Panel
          </Link>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                <h5>Textos de la Página</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Título del Hero</label>
                  <input
                    type="text"
                    className="form-control"
                    name="heroTitle"
                    value={siteContent.heroTitle}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción del Hero</label>
                  <textarea
                    className="form-control"
                    name="heroDescription"
                    value={siteContent.heroDescription}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Quiénes Somos</label>
                  <textarea
                    className="form-control"
                    name="aboutUs"
                    value={siteContent.aboutUs}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Misión</label>
                  <textarea
                    className="form-control"
                    name="mission"
                    value={siteContent.mission}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Visión</label>
                  <textarea
                    className="form-control"
                    name="vision"
                    value={siteContent.vision}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </div>
            </div>


            <div className="card mb-4">
              <div className="card-header">
                <h5>Logo de la Empresa</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Seleccionar Logo</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleLogoUpload(file);
                      }
                    }}
                  />
                  <small className="form-text text-muted">
                    Selecciona una imagen PNG, JPG o GIF (máximo 1MB). Se comprimirá automáticamente y se subirá a ImgBB.
                  </small>
                </div>
                {siteContent.logo && (
                  <div className="mt-3">
                    <img
                      src={siteContent.logo}
                      alt="Logo preview"
                      style={{ maxHeight: '100px', maxWidth: '200px' }}
                      className="img-thumbnail"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h5>Imagen del Hero</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Seleccionar Imagen del Hero</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleHeroImageUpload(file);
                      }
                    }}
                  />
                  <small className="form-text text-muted">
                    Selecciona una imagen PNG, JPG o GIF (máximo 3MB). Se comprimirá automáticamente y se subirá a ImgBB.
                  </small>
                </div>
                {siteContent.heroImage && (
                  <div className="mt-3">
                    <img
                      src={siteContent.heroImage}
                      alt="Hero preview"
                      style={{ maxHeight: '200px', maxWidth: '100%' }}
                      className="img-thumbnail"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h5>Redes Sociales</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Facebook</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://facebook.com/tu-pagina"
                    value={siteContent.socialLinks.facebook}
                    onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Instagram</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://instagram.com/tu-cuenta"
                    value={siteContent.socialLinks.instagram}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Gmail</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="tu-email@gmail.com"
                    value={siteContent.socialLinks.gmail}
                    onChange={(e) => handleSocialLinkChange('gmail', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">YouTube</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://youtube.com/canal/tu-canal"
                    value={siteContent.socialLinks.youtube}
                    onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">TikTok</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://tiktok.com/@tu-usuario"
                    value={siteContent.socialLinks.tiktok}
                    onChange={(e) => handleSocialLinkChange('tiktok', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">WhatsApp</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+57 300 123 4567"
                    value={siteContent.whatsapp}
                    onChange={(e) => setSiteContent(prev => ({ ...prev, whatsapp: e.target.value }))}
                  />
                  <small className="form-text text-muted">
                    Número de teléfono para el botón flotante de WhatsApp
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5>Acciones</h5>
              </div>
              <div className="card-body">
                <button className="btn btn-primary w-100 mb-3" onClick={handleSave}>
                  Guardar Cambios
                </button>
                <Link href="/" className="btn btn-outline-primary w-100">
                  Ver Página Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}