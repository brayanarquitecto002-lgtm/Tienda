# Configuración de Base de Datos - Supabase

Esta guía explica cómo configurar la base de datos PostgreSQL gratis en Supabase para el proyecto Tienda Arquitectura.

## Requisitos Previos

- Cuenta en Supabase (https://supabase.com) - **100% gratis**
- Proyecto creado en Supabase

## Pasos de Configuración

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y regístrate
2. Haz clic en **"New Project"**
3. Elige un nombre para tu proyecto (ej: `tienda-arquitectura`)
4. Selecciona una región cercana (ej: `West US (North California)`)
5. Crea una contraseña para la base de datos
6. Espera 2-3 minutos a que se configure el proyecto

### 2. Configurar la Base de Datos

1. En tu proyecto de Supabase, ve a la pestaña **"SQL Editor"**
2. Copia y pega el contenido del archivo `database-schema.sql`
3. Haz clic en **"Run"** para ejecutar el script

### 3. Obtener las Credenciales

1. Ve a **Settings** → **API**
2. Copia estos valores:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. Verificar la Instalación

Después de ejecutar el script, deberías ver en **Table Editor**:

- Tabla: `site_content` (contenido del sitio)
- Tabla: `products` (productos)
- Tabla: `product_features` (características de productos)

### 5. Configurar Variables de Entorno

Crea o actualiza el archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
NEXT_PUBLIC_IMGBB_API_KEY=3cdeef6e840716d034ca88855d9d0a5d
```

### 6. Instalar Dependencias

```bash
npm install @supabase/supabase-js
```

### 7. Configurar Conexión en Next.js

El archivo `lib/db.ts` ya está configurado para Supabase:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## Funcionalidades Incluidas

### ✅ **Gestión de Contenido del Sitio**
- Título y descripción del hero
- Información de la empresa (Quiénes somos, Misión, Visión)
- Logo e imagen principal
- Enlaces de redes sociales
- Número de WhatsApp

### ✅ **Gestión de Productos**
- CRUD completo de productos
- Subida de imágenes (base64)
- Características personalizables
- Precios y descripciones

### ✅ **Panel de Administración**
- `/admin/home` - Configurar contenido del sitio
- `/admin/catalogo` - Gestionar productos

## Notas Importantes

- **Gratis**: Supabase ofrece 500MB gratis sin tarjeta de crédito
- **Escalable**: Se puede actualizar a planes pagos cuando crezca
- **Seguro**: Conexión SSL automática
- **Real-time**: Soporte para actualizaciones en tiempo real

## Solución de Problemas

### Error de conexión
- Verifica las variables de entorno
- Confirma que las claves de Supabase sean correctas
- Revisa que el proyecto esté activo

### Tablas no creadas
- Ejecuta el SQL en el SQL Editor de Supabase
- Revisa los errores en la consola de Supabase

### Problemas de permisos
- Las claves `anon` tienen permisos de lectura/escritura por defecto
- Para producción, configura Row Level Security (RLS)

## Próximos Pasos

1. **Desarrolla localmente** con `npm run dev`
2. **Despliega a Vercel** con las variables de entorno
3. **Configura dominio personalizado** si es necesario
4. **Monitorea uso** en el dashboard de Supabase

¡Tu tienda de arquitectura ya está lista con base de datos en la nube! 🎉