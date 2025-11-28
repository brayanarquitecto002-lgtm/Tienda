export interface Product {
  id?: string;
  name: string;
  description: string;
  image: string;
  price: string;
  details: string;
  features: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

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

const PRODUCTS_KEY = 'tienda_products';
const SITE_CONTENT_KEY = 'tienda_site_content';

// Configuración de Upstash Redis
const UPSTASH_URL = process.env.KV_REST_API_URL || 'https://fast-bullfrog-32172.upstash.io';
const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN || 'AX2sAAIncDIxYTc5MTAzZDZkNTg0ZDMyOTNiOTljZTI3MTNkNjk2MXAyMzIxNzI';

// Función para hacer requests GET a Upstash
async function upstashGet(key: string): Promise<any> {
  console.log('🔗 Upstash GET:', { key, url: UPSTASH_URL });

  try {
    const response = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${UPSTASH_TOKEN}`,
      },
    });

    console.log('📡 Upstash Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Upstash Error Response:', errorText);
      throw new Error(`Upstash error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Upstash Response Data:', data);
    return data.result;
  } catch (error) {
    console.error('💥 Upstash GET Failed:', error);
    throw error;
  }
}

// Función para hacer requests SET a Upstash
async function upstashSet(key: string, value: string): Promise<any> {
  console.log('🔗 Upstash SET:', { key, value: value.substring(0, 100) + '...', url: UPSTASH_URL });

  try {
    const response = await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: value,
    });

    console.log('📡 Upstash Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Upstash Error Response:', errorText);
      throw new Error(`Upstash error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Upstash Response Data:', data);
    return data.result;
  } catch (error) {
    console.error('💥 Upstash SET Failed:', error);
    throw error;
  }
}

// Función para probar la conexión a Upstash
export const testUpstashConnection = async (): Promise<boolean> => {
  try {
    console.log('🧪 Probando conexión a Upstash Redis...');
    console.log('🔑 Variables de entorno:', {
      UPSTASH_URL: UPSTASH_URL ? 'Configurada' : 'Faltante',
      UPSTASH_TOKEN: UPSTASH_TOKEN ? 'Configurada' : 'Faltante',
    });

    // Intentar hacer un ping usando SET y GET de una clave de prueba
    const testKey = 'test_connection';
    const testValue = 'ok';
    await upstashSet(testKey, testValue);
    const result = await upstashGet(testKey);
    console.log('✅ Conexión a Upstash exitosa:', result);
    return result === testValue;
  } catch (error) {
    console.error('❌ Error conectando a Upstash:', error);
    return false;
  }
};

// Función para comprimir imagen base64
const compressBase64Image = (base64String: string, maxWidth: number = 400, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // Calcular nuevas dimensiones
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Dibujar y comprimir
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir a base64 comprimido
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    img.src = base64String;
  });
};

// Subir imagen de producto (comprimir base64)
export const uploadProductImage = async (file: File, productId: string): Promise<string | null> => {
  console.log('🖼️ Procesando imagen de producto...');
  console.log('📋 Parámetros:', { fileName: file.name, fileSize: file.size, productId });

  try {
    // Validar tamaño del archivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('La imagen es demasiado grande. Máximo 5MB.');
    }

    console.log('🗜️ Comprimiendo imagen...');
    const compressedBase64 = await compressBase64Image(URL.createObjectURL(file), 800, 0.85);
    console.log(`✅ Imagen comprimida: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

    console.log('🎉 Imagen procesada exitosamente');
    return compressedBase64;
  } catch (error) {
    console.error('💥 Error procesando imagen:', error);
    return null;
  }
};

// Productos de ejemplo
const getExampleProducts = (): Product[] => [
  {
    id: 'example-1',
    name: 'Casa Moderna Minimalista',
    description: 'Diseño contemporáneo con líneas limpias y espacios abiertos.',
    image: 'https://picsum.photos/400/300?random=1',
    price: 'Desde $150.000',
    details: 'Superficie: 200m², Habitaciones: 3, Baños: 2',
    features: ['Espacios abiertos', 'Iluminación natural', 'Materiales sostenibles'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'example-2',
    name: 'Edificio Comercial Urbano',
    description: 'Estructura funcional para espacios comerciales en zona urbana.',
    image: 'https://picsum.photos/400/300?random=2',
    price: 'Desde $500.000',
    details: 'Superficie: 500m², Pisos: 5, Ascensores: 2',
    features: ['Accesibilidad total', 'Espacios flexibles', 'Iluminación LED'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'example-3',
    name: 'Residencia Sostenible',
    description: 'Diseño ecoamigable con materiales reciclables y eficiencia energética.',
    image: 'https://picsum.photos/400/300?random=3',
    price: 'Desde $200.000',
    details: 'Superficie: 180m², Habitaciones: 4, Baños: 3',
    features: ['Paneles solares', 'Aislamiento térmico', 'Jardín vertical'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'example-4',
    name: 'Oficina Corporativa',
    description: 'Espacios de trabajo modernos y productivos.',
    image: 'https://picsum.photos/400/300?random=4',
    price: 'Desde $300.000',
    details: 'Superficie: 300m², Escritorios: 50, Salas de reunión: 3',
    features: ['Espacios colaborativos', 'Tecnología integrada', 'Acústica optimizada'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Obtener todos los productos
export const getProducts = async (): Promise<Product[]> => {
  try {
    console.log('🔍 Intentando cargar productos desde Upstash Redis...');
    const productsJson = await upstashGet(PRODUCTS_KEY);
    let products = productsJson ? JSON.parse(productsJson) : [];

    if (products && products.length > 0) {
      // Asegurar que todos los productos tengan imagen
      products = products.map((product: Product) => ({
        ...product,
        image: product.image || `https://picsum.photos/400/300?random=${product.id || '999'}`
      }));

      console.log('✅ Productos cargados desde Upstash:', products.length);
      return products;
    } else {
      console.log('📝 No hay productos en Redis, mostrando productos de ejemplo...');
      return getExampleProducts();
    }
  } catch (error) {
    console.error('❌ Error cargando productos desde Upstash:', error);
    console.log('📝 Mostrando productos de ejemplo como fallback...');
    return getExampleProducts();
  }
};

// Agregar un nuevo producto
export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
  try {
    // Comprimir imagen si es base64
    const processedProduct = { ...product };
    if (product.image && product.image.startsWith('data:image/')) {
      console.log('🗜️ Comprimiendo imagen base64...');
      processedProduct.image = await compressBase64Image(product.image, 400, 0.7);
      console.log('✅ Imagen comprimida');
    }

    // Crear producto con ID único
    const newProduct: Product = {
      ...processedProduct,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Obtener productos existentes y agregar el nuevo
    const existingProductsJson = await upstashGet(PRODUCTS_KEY);
    const existingProducts = existingProductsJson ? JSON.parse(existingProductsJson) : [];
    existingProducts.push(newProduct);

    // Guardar en Upstash
    await upstashSet(PRODUCTS_KEY, JSON.stringify(existingProducts));

    console.log('✅ Producto agregado a Upstash Redis:', newProduct.name);
    return newProduct.id || null;
  } catch (error) {
    console.error('❌ Error agregando producto a Upstash:', error);
    return null;
  }
};

// Actualizar un producto
export const updateProduct = async (id: string, product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
  try {
    const existingProductsJson = await upstashGet(PRODUCTS_KEY);
    const existingProducts = existingProductsJson ? JSON.parse(existingProductsJson) : [];
    const index = existingProducts.findIndex((p: Product) => p.id === id);

    if (index !== -1) {
      existingProducts[index] = {
        ...existingProducts[index],
        ...product,
        updatedAt: new Date()
      };
      await upstashSet(PRODUCTS_KEY, JSON.stringify(existingProducts));
      console.log('✅ Producto actualizado en Upstash Redis:', id);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error actualizando producto en Upstash:', error);
    return false;
  }
};

// Eliminar un producto
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const existingProductsJson = await upstashGet(PRODUCTS_KEY);
    const existingProducts = existingProductsJson ? JSON.parse(existingProductsJson) : [];
    const filteredProducts = existingProducts.filter((p: Product) => p.id !== id);
    await upstashSet(PRODUCTS_KEY, JSON.stringify(filteredProducts));
    console.log('✅ Producto eliminado de Upstash Redis:', id);
    return true;
  } catch (error) {
    console.error('❌ Error eliminando producto de Upstash:', error);
    return false;
  }
};

// Obtener contenido del sitio
export const getSiteContent = async (): Promise<SiteContent> => {
  try {
    const contentJson = await upstashGet(SITE_CONTENT_KEY);
    const content = contentJson ? JSON.parse(contentJson) : null;
    return content || {
      heroTitle: 'Arquitectura Pro',
      heroDescription: 'Diseños arquitectónicos innovadores y sostenibles para transformar tus espacios.',
      aboutUs: 'Somos un equipo de arquitectos apasionados por crear espacios funcionales, estéticos y sostenibles. Con años de experiencia, hemos diseñado proyectos residenciales, comerciales e institucionales.',
      mission: 'Nuestra misión es proporcionar soluciones arquitectónicas de alta calidad que mejoren la calidad de vida de nuestros clientes, integrando innovación, sostenibilidad y funcionalidad en cada proyecto.',
      vision: 'Ser líderes en el diseño arquitectónico, reconocidos por nuestra excelencia, creatividad y compromiso con el desarrollo urbano sostenible.',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3cy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA3YmZmIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvZ288L3RleHQ+Cjwvc3ZnPgo=',
      heroImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiM2Yzc1N2QiLz48dGV4dCB4PSI2MDAiIHk9IjMwMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SGVybzogQXJxdWl0ZWN0dXJhIFBybzwvdGV4dD48L3N2Zz4K',
      socialLinks: {
        facebook: '',
        instagram: '',
        gmail: '',
        youtube: '',
        tiktok: '',
      },
      whatsapp: '',
    };
  } catch (error) {
    console.error('❌ Error cargando contenido del sitio:', error);
    return {
      heroTitle: 'Arquitectura Pro',
      heroDescription: 'Diseños arquitectónicos innovadores y sostenibles para transformar tus espacios.',
      aboutUs: 'Somos un equipo de arquitectos apasionados por crear espacios funcionales, estéticos y sostenibles. Con años de experiencia, hemos diseñado proyectos residenciales, comerciales e institucionales.',
      mission: 'Nuestra misión es proporcionar soluciones arquitectónicas de alta calidad que mejoren la calidad de vida de nuestros clientes, integrando innovación, sostenibilidad y funcionalidad en cada proyecto.',
      vision: 'Ser líderes en el diseño arquitectónico, reconocidos por nuestra excelencia, creatividad y compromiso con el desarrollo urbano sostenible.',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3cy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDA3YmZmIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxvZ288L3RleHQ+Cjwvc3ZnPgo=',
      heroImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiM2Yzc1N2QiLz48dGV4dCB4PSI2MDAiIHk9IjMwMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SGVybzogQXJxdWl0ZWN0dXJhIFBybzwvdGV4dD48L3N2Zz4K',
      socialLinks: {
        facebook: '',
        instagram: '',
        gmail: '',
        youtube: '',
        tiktok: '',
      },
      whatsapp: '',
    };
  }
};

// Guardar contenido del sitio
export const saveSiteContent = async (content: SiteContent): Promise<boolean> => {
  try {
    await upstashSet(SITE_CONTENT_KEY, JSON.stringify(content));
    console.log('✅ Contenido del sitio guardado en Upstash Redis');
    return true;
  } catch (error) {
    console.error('❌ Error guardando contenido del sitio:', error);
    return false;
  }
};