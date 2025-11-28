import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Admin() {
  return (
    <Layout>
      <div className="container py-5">
        <h1 className="text-center mb-5">Panel de Administrador</h1>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">🧪 Probar Base de Datos</h5>
                <p className="card-text">Verificar conexión a Upstash Redis y probar funcionalidades.</p>
                <Link href="/admin/test" className="btn btn-warning">
                  Ir a Pruebas
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Editar Página Home</h5>
                <p className="card-text">Modificar textos, imágenes del carrusel y logo de la empresa.</p>
                <Link href="/admin/home" className="btn btn-primary">
                  Ir a Editar Home
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Gestionar Catálogo</h5>
                <p className="card-text">Agregar, editar y eliminar productos con imágenes.</p>
                <Link href="/admin/catalogo" className="btn btn-primary">
                  Ir a Catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}