# Manual de Usuario - Tienda Virtual de Arquitectura

## 📋 Descripción General

Este proyecto es una **tienda virtual completa** para servicios de arquitectura, construida con Next.js 16, React 19, y Bootstrap 5. Incluye dos versiones principales:

- **tienda-frontend**: Versión con base de datos Supabase (PostgreSQL)
- **tienda-arquitectura**: Versión con Firebase (Firestore)

Ambas versiones ofrecen las mismas funcionalidades de usuario final, pero difieren en la infraestructura backend.

## 🚀 Funcionalidades Principales

### Para Clientes (Sitio Público)
- **Página de Inicio**: Hero section, información de la empresa, misión/visión
- **Catálogo de Productos**: Exploración de diseños arquitectónicos
- **Vista Detallada de Productos**: Información completa de cada servicio
- **Redes Sociales**: Enlaces a Facebook, Instagram, YouTube, TikTok, Gmail
- **Contacto WhatsApp**: Botón flotante para contacto directo

### Para Administradores (Panel de Control)
- **Gestión de Contenido del Sitio**: Editar textos, logo, imágenes
- **Gestión de Catálogo**: Agregar, editar, eliminar productos
- **Subida de Imágenes**: Integración con ImgBB para almacenamiento
- **Configuración de Redes Sociales**: Enlaces y WhatsApp

## 📁 Estructura del Proyecto

```
BASE TIENDA VIRTUAL/
├── tienda-frontend/          # Versión con Supabase
├── tienda-arquitectura/      # Versión con Firebase
├── database-schema.sql       # Esquema de base de datos
├── README_DATABASE_SETUP.md  # Configuración Supabase
└── MANUAL_USUARIO.md         # Este manual
```

## 🛠️ Instalación y Configuración

### Requisitos Previos
- Node.js 18+
- npm o yarn
- Cuenta en servicio de hosting (Vercel recomendado)

### Paso 1: Elegir Versión
Decide qué versión usar:
- **Supabase**: Más robusto, mejor para producción
- **Firebase**: Más simple, gratuito pero limitado

### Paso 2: Instalar Dependencias
```bash
# Para tienda-frontend
cd tienda-frontend
npm install

# Para tienda-arquitectura
cd tienda-arquitectura
npm install
```

### Paso 3: Configurar Base de Datos

#### Opción A: Supabase (tienda-frontend)
1. Ve a [supabase.com](https://supabase.com) y crea cuenta gratuita
2. Crea un nuevo proyecto
3. Ve a SQL Editor y ejecuta el contenido de `database-schema.sql`
4. Obtén URL y API key desde Settings → API
5. Crea `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
NEXT_PUBLIC_IMGBB_API_KEY=3cdeef6e840716d034ca88855d9d0a5d
```

#### Opción B: Firebase (tienda-arquitectura)
1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Crea un nuevo proyecto
3. Habilita Firestore Database
4. Configura reglas de seguridad (lee README_FIREBASE_SETUP.md)
5. Obtén configuración del proyecto
6. Crea `.env.local` con las credenciales de Firebase

### Paso 4: Configurar ImgBB (Ambas versiones)
1. Ve a [imgbb.com](https://imgbb.com) y crea cuenta gratuita
2. Obtén tu API key
3. Agrega al `.env.local`:
```env
NEXT_PUBLIC_IMGBB_API_KEY=tu_api_key_aqui
```

### Paso 5: Ejecutar en Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000)

## 🎨 Uso del Sitio Web

### Navegación
- **Inicio (/)**: Página principal con información de la empresa
- **Tienda (/tienda)**: Catálogo de productos
- **Admin (/admin)**: Panel de administración

### Explorar Productos
1. Desde la página principal, haz clic en "Ver Catálogo"
2. Navega por los productos disponibles
3. Haz clic en cualquier producto para ver detalles
4. Usa el botón de WhatsApp para contactar

## ⚙️ Panel de Administración

### Acceso
Ve a `/admin` desde tu navegador.

### Gestión de Contenido del Sitio (/admin/home)

#### Editar Textos
1. **Título del Hero**: Texto principal destacado
2. **Descripción del Hero**: Texto descriptivo debajo del título
3. **Quiénes Somos**: Información sobre la empresa
4. **Misión**: Objetivos de la empresa
5. **Visión**: Metas a futuro

#### Subir Logo
1. Haz clic en "Seleccionar Logo"
2. Elige imagen PNG/JPG/GIF (máximo 2MB)
3. Se comprime automáticamente y sube a ImgBB
4. Vista previa se muestra inmediatamente

#### Subir Imagen del Hero
1. Haz clic en "Seleccionar Imagen del Hero"
2. Elige imagen PNG/JPG/GIF (máximo 3MB)
3. Se comprime automáticamente (máximo 1200px ancho)
4. Vista previa se muestra inmediatamente

#### Configurar Redes Sociales
- **Facebook**: URL completa de tu página
- **Instagram**: URL de tu perfil
- **Gmail**: Dirección de email (se abre en cliente de correo)
- **YouTube**: URL de tu canal
- **TikTok**: URL de tu perfil
- **WhatsApp**: Número de teléfono (para botón flotante)

#### Guardar Cambios
1. Haz clic en "Guardar Cambios"
2. Los cambios se aplican automáticamente al sitio público
3. Mensaje de confirmación aparece

### Gestión de Catálogo (/admin/catalogo)

#### Agregar Nuevo Producto
1. **Nombre**: Título del servicio arquitectónico
2. **Descripción**: Breve descripción del servicio
3. **Imagen**: Sube imagen del proyecto (máximo 5MB)
4. **Precio**: Costo del servicio (formato colombiano automático)
5. **Detalles**: Información adicional
6. **Características**: Lista separada por comas

#### Proceso de Subida de Imagen
1. Selecciona archivo de imagen
2. Espera el mensaje "Imagen subida exitosamente"
3. Completa el resto del formulario
4. Haz clic en "Agregar Producto"

#### Editar Producto Existente
1. En la lista de productos, haz clic "Editar"
2. Modifica los campos necesarios
3. Si cambias imagen, espera confirmación de subida
4. Haz clic "Actualizar Producto"

#### Eliminar Producto
1. Haz clic "Eliminar" en el producto deseado
2. Confirma la eliminación en el diálogo

## 📱 Componentes y Funcionalidades

### Layout Principal
- **Navbar**: Navegación superior con logo y menú
- **Footer**: Información de contacto y enlaces
- **WhatsApp Button**: Botón flotante para contacto rápido

### ProductCard
- Imagen del producto
- Nombre y descripción
- Precio formateado
- Enlace a vista detallada

### Responsive Design
- Optimizado para móviles y desktop
- Bootstrap 5 para diseño responsivo
- Tailwind CSS para utilidades adicionales

## 🔧 Configuración Avanzada

### Variables de Entorno
```env
# Base de datos
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# O Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# Imágenes
NEXT_PUBLIC_IMGBB_API_KEY=...

# Vercel KV (opcional)
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

### Despliegue en Vercel
1. Conecta tu repositorio de GitHub
2. Agrega variables de entorno
3. Despliega automáticamente

### Reglas de Firestore (Firebase)
Si usas Firebase, configura reglas en Firestore:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document} {
      allow read: if true;
      allow write: if false;
    }
    match /siteContent/{document} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## 🐛 Solución de Problemas

### Imágenes no se cargan
- Verifica API key de ImgBB
- Revisa límites de tamaño (2MB logos, 3MB hero, 5MB productos)
- Confirma conexión a internet

### Base de datos no funciona
- **Supabase**: Verifica credenciales y que tablas existen
- **Firebase**: Revisa reglas de seguridad y configuración

### Cambios no se guardan
- Confirma que imagen se subió antes de guardar
- Revisa consola del navegador por errores
- Verifica permisos de escritura en base de datos

### Error al subir imágenes
- API key de ImgBB expirada o inválida
- Archivo demasiado grande
- Problemas de red

## 📊 Arquitectura Técnica

### Tecnologías
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Bootstrap 5, Tailwind CSS
- **Backend**: Next.js API Routes (Supabase) o Firebase
- **Base de Datos**: PostgreSQL (Supabase) o Firestore (Firebase)
- **Almacenamiento**: ImgBB para imágenes
- **Hosting**: Vercel

### Estructura de Datos

#### Site Content
```typescript
{
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
```

#### Product
```typescript
{
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  details: string;
  features: string[];
}
```

## 🎯 Próximos Pasos

1. **Personalización**: Adapta textos e imágenes a tu marca
2. **SEO**: Configura meta tags y optimización
3. **Analytics**: Integra Google Analytics
4. **Pagos**: Agrega integración de pagos
5. **CMS**: Expande panel de administración

## 📞 Soporte

Para soporte técnico:
1. Revisa este manual completo
2. Consulta archivos README específicos
3. Revisa consola del navegador por errores
4. Verifica configuración de servicios externos

¡Tu tienda virtual de arquitectura está lista para recibir clientes! 🏗️✨