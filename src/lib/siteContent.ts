// Re-exportar desde vercel-kv para mantener compatibilidad
export { getSiteContent, saveSiteContent, type SiteContent } from './vercel-kv';

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

// Subir logo a ImgBB
export const uploadLogo = async (file: File): Promise<string | null> => {
  try {
    // Validar tamaño del archivo (máximo 1MB para logos)
    if (file.size > 1 * 1024 * 1024) {
      throw new Error('El logo es demasiado grande. Máximo 1MB.');
    }

    console.log('Comprimiendo logo...');
    const compressedFile = await compressImage(file, 300, 0.9); // Logos más pequeños
    console.log(`Logo comprimido: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

    // Subir a ImgBB
    console.log('Subiendo logo a ImgBB...');
    const formData = new FormData();
    formData.append('image', compressedFile);

    // Tu API Key de ImgBB - reemplaza con la tuya
    const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'TU_API_KEY_AQUI';

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error en ImgBB: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success) {
      const imageUrl = data.data.url;
      console.log('Logo subido exitosamente a ImgBB:', imageUrl);
      return imageUrl;
    } else {
      throw new Error('Error en la respuesta de ImgBB');
    }
  } catch (error) {
    console.error('Error procesando logo:', error);
    return null;
  }
};