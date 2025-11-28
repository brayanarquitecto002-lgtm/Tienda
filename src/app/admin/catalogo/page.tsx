'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { getProducts, addProduct, deleteProduct, uploadProductImage, Product } from '@/lib/products';

export default function AdminCatalogo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
    details: '',
    features: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file: File) => {
    console.log('🚀 Iniciando proceso de subida de imagen...');
    console.log('📁 Archivo:', file.name, 'Tamaño:', (file.size / 1024 / 1024).toFixed(2), 'MB');

    // Validar tamaño antes de subir (máximo 5MB para productos)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 5MB.');
      return;
    }

    setUploading(true);
    try {
      console.log('📤 Llamando a uploadProductImage...');
      const productId = Date.now().toString();
      const imageUrl = await uploadProductImage(file, productId);

      if (imageUrl) {
        console.log('✅ Imagen subida exitosamente:', imageUrl);
        setFormData(prev => ({ ...prev, image: imageUrl }));
        alert('Imagen subida exitosamente');
      } else {
        console.error('❌ La función uploadProductImage retornó null');
        alert('Error: No se pudo obtener la URL de la imagen subida');
      }
    } catch (error) {
      console.error('💥 Error detallado al subir imagen:', error);
      console.error('🔍 Tipo de error:', typeof error);
      console.error('📋 Error completo:', error);
      alert(`Error al subir la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      alert('Por favor, selecciona y espera a que se suba una imagen antes de agregar el producto.');
      return;
    }

    try {
      const newProductData = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        price: formData.price,
        details: formData.details,
        features: formData.features.split(',').map(f => f.trim()),
      };

      const productId = await addProduct(newProductData);
      if (productId) {
        await loadProducts(); // Recargar productos
        window.dispatchEvent(new CustomEvent('productsUpdated'));
        setFormData({
          name: '',
          description: '',
          image: '',
          price: '',
          details: '',
          features: '',
        });
        alert('Producto agregado exitosamente');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error al agregar el producto');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      const success = await deleteProduct(id);
      if (success) {
        await loadProducts(); // Recargar productos
        window.dispatchEvent(new CustomEvent('productsUpdated'));
        alert('Producto eliminado exitosamente');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  };

  return (
    <Layout>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Gestionar Catálogo</h1>
          <Link href="/admin" className="btn btn-secondary">
            ← Volver al Panel
          </Link>
        </div>

        <div className="row">
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-header">
                <h5>Agregar Nuevo Producto</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Imagen del Producto</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file);
                        }
                      }}
                      disabled={uploading}
                    />
                    {uploading && (
                      <div className="mt-2">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Subiendo...</span>
                        </div>
                        <span className="ms-2">Subiendo imagen...</span>
                      </div>
                    )}
                    {formData.image && !uploading && (
                      <div className="mt-2">
                        <img
                          src={formData.image}
                          alt="Preview"
                          style={{ maxHeight: '100px', maxWidth: '100%' }}
                          className="img-thumbnail"
                        />
                      </div>
                    )}
                    <small className="form-text text-muted">
                      Selecciona una imagen PNG, JPG o GIF (máximo 5MB). Se comprimirá automáticamente y se subirá a ImgBB. Espera a que aparezca la vista previa antes de enviar el formulario.
                    </small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input
                      type="text"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Detalles</label>
                    <input
                      type="text"
                      className="form-control"
                      name="details"
                      value={formData.details}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Características (separadas por coma)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={uploading}>
                    {uploading ? 'Subiendo imagen...' : 'Agregar Producto'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h5>Productos Actuales</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {products.map(product => (
                    <div key={product.id} className="col-md-6 mb-3">
                      <div className="card h-100">
                        <img
                          src={product.image}
                          className="card-img-top"
                          alt={product.name}
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h6 className="card-title">{product.name}</h6>
                          <p className="card-text small flex-grow-1">{product.description}</p>
                          <p className="fw-bold text-primary">{product.price}</p>
                          <button
                            className="btn btn-danger btn-sm mt-auto"
                            onClick={() => product.id && handleDelete(product.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}