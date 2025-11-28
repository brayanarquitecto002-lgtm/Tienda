import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

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

const COLLECTION_NAME = 'products';

// Obtener todos los productos
export const getProducts = async (): Promise<Product[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Product[];

    // Si no hay productos en Firebase, devolver productos de ejemplo
    if (products.length === 0) {
      console.log('No hay productos en Firebase, mostrando productos de ejemplo...');
      return getExampleProducts();
    }

    return products;
  } catch (error) {
    console.error('Error getting products from Firebase:', error);
    console.log('Mostrando productos de ejemplo como fallback...');
    // Fallback: devolver productos de ejemplo si Firebase falla
    return getExampleProducts();
  }
};

// Productos de ejemplo con URLs válidas
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

// Agregar un nuevo producto
export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
};

// Eliminar un producto
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
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

// Subir imagen a ImgBB (servicio gratuito)
export const uploadProductImage = async (file: File, productId: string): Promise<string | null> => {
  try {
    // Validar tamaño del archivo (ImgBB permite hasta 32MB, pero limitamos a 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('La imagen es demasiado grande. Máximo 5MB.');
    }

    console.log('Comprimiendo imagen...');
    const compressedFile = await compressImage(file, 800, 0.85); // Mejor calidad para ImgBB
    console.log(`Imagen comprimida: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

    // Subir a ImgBB
    console.log('Subiendo a ImgBB...');
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
      console.log('Imagen subida exitosamente a ImgBB:', imageUrl);
      return imageUrl;
    } else {
      throw new Error('Error en la respuesta de ImgBB');
    }
  } catch (error) {
    console.error('Error detallado al subir imagen:', error);
    if (error instanceof Error) {
      console.error('Mensaje de error:', error.message);
      console.error('Stack:', error.stack);
    }
    return null;
  }
};