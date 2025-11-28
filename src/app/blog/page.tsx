import Layout from '@/components/Layout';

export default function Blog() {
  return (
    <Layout>
      <div className="container py-5">
        <h1 className="text-center mb-4">Blog de Arquitectura</h1>
        <p className="text-center lead mb-5">
          Artículos, tendencias y consejos sobre diseño arquitectónico
        </p>

        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="alert alert-info text-center" role="alert">
              <h4>Próximamente</h4>
              <p>Estamos preparando contenido interesante sobre arquitectura y diseño.
              ¡Mantente atento a nuestras publicaciones!</p>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Tendencias en Arquitectura Moderna</h5>
                <p className="card-text">
                  Descubre las últimas tendencias en diseño arquitectónico sostenible y moderno.
                </p>
                <small className="text-muted">Próximamente...</small>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Consejos para Diseño de Interiores</h5>
                <p className="card-text">
                  Guías prácticas para crear espacios funcionales y estéticos.
                </p>
                <small className="text-muted">Próximamente...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}