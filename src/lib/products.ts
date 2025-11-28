// Tipos para productos
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  details: string;
  features: string[];
}

// Datos mock de productos para frontend puro
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Plano Arquitectónico Residencial',
    description: 'Diseño completo de vivienda unifamiliar con planos detallados.',
    price: '$500.000',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&crop=center',
    details: 'Planos completos incluyendo fachadas, cortes y detalles constructivos.',
    features: ['Planos 2D y 3D', 'Cálculos estructurales', 'Memoria descriptiva'],
  },
  {
    id: '2',
    name: 'Proyecto Arquitectónico Comercial',
    description: 'Diseño de local comercial con énfasis en funcionalidad y estética.',
    price: '$750.000',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&crop=center',
    details: 'Proyecto integral para espacios comerciales con diseño moderno.',
    features: ['Diseño de interiores', 'Iluminación especializada', 'Accesibilidad universal'],
  },
  {
    id: '3',
    name: 'Remodelación de Espacios',
    description: 'Servicio de remodelación para optimizar espacios existentes.',
    price: '$300.000',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center',
    details: 'Transformación completa de espacios para mejorar funcionalidad.',
    features: ['Análisis de espacio', 'Diseño personalizado', 'Supervisión de obra'],
  },
];

// Función para obtener productos desde la API
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('/api/products');
    const data = await response.json();

    if (data.success) {
      return data.products.map((product: any) => ({
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        details: product.details,
        features: product.features
      }));
    } else {
      console.error('Error fetching products:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Función para agregar producto via API
export const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    const data = await response.json();

    if (data.success) {
      return data.productId.toString();
    } else {
      throw new Error(data.message || 'Error al agregar producto');
    }
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Función para actualizar producto via API
export const updateProduct = async (id: string, product: Partial<Product>): Promise<boolean> => {
  try {
    const response = await fetch('/api/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...product }),
    });

    const data = await response.json();

    if (data.success) {
      return true;
    } else {
      throw new Error(data.message || 'Error al actualizar producto');
    }
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Función para eliminar producto via API
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/products?id=${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (data.success) {
      return true;
    } else {
      throw new Error(data.message || 'Error al eliminar producto');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Función para subir imagen de producto (convierte a base64)
export const uploadProductImage = async (file: File, productId?: string): Promise<string> => {
  try {
    // Validar tamaño del archivo (máximo 5MB para productos)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('La imagen es demasiado grande. Máximo 5MB.');
    }

    console.log('Procesando imagen de producto...');

    // Convertir imagen a base64
    const base64String = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    console.log('Imagen de producto procesada exitosamente (base64)');
    return base64String;

  } catch (error) {
    console.error('Error procesando imagen de producto:', error);
    return 'https://picsum.photos/400/300?random=error';
  }
};

// Función mock para probar conexión (siempre retorna true en frontend puro)
export const testUpstashConnection = async (): Promise<boolean> => {
  return true;
};