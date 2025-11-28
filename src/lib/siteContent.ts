// Tipos para el contenido del sitio
export interface SiteContent {
  heroTitle: string;
  heroDescription: string;
  aboutUs: string;
  mission: string;
  vision: string;
  logo: string;
  heroImage: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    gmail: string;
    youtube: string;
    tiktok: string;
  };
  whatsapp: string;
}

// Función para obtener contenido del sitio desde la API
export const getSiteContent = async (): Promise<SiteContent | null> => {
  try {
    const response = await fetch('/api/site-content');
    const data = await response.json();

    if (data.success) {
      return data.content;
    } else {
      console.error('Error fetching site content:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching site content:', error);
    return null;
  }
};

// Función para guardar contenido del sitio via API
export const saveSiteContent = async (content: SiteContent): Promise<boolean> => {
  try {
    const response = await fetch('/api/site-content', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });

    const data = await response.json();

    if (data.success) {
      // Disparar evento para actualizar componentes
      if (typeof window !== 'undefined') {
        console.log('siteContent.ts: Disparando evento siteContentUpdated con logo:', content.logo);
        window.dispatchEvent(new CustomEvent('siteContentUpdated', { detail: content }));
      }
      return true;
    } else {
      console.error('Error saving site content:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Error saving site content:', error);
    return false;
  }
};

// Función para comprimir imagen
const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo aspect ratio
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Dibujar y comprimir
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          resolve(file); // fallback
        }
      }, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

// Subir logo (versión simplificada para desarrollo)
export const uploadLogo = async (file: File): Promise<string | null> => {
  try {
    // Validar tamaño del archivo (máximo 2MB para logos)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('El logo es demasiado grande. Máximo 2MB.');
    }

    console.log('Procesando logo...');

    // Para desarrollo, convertimos a base64 y retornamos como data URL
    // En producción, reemplaza con un servicio de hosting de imágenes real
    const base64String = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    console.log('Logo procesado exitosamente (base64)');
    return base64String;

  } catch (error) {
    console.error('Error procesando logo:', error);
    return null;
  }
};