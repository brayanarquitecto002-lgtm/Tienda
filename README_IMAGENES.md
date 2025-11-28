# Cómo Agregar Imágenes a tu Tienda Virtual

## Método Actual: Subida Directa desde Archivos

### 1. Desde el Panel de Administrador
- **Para el logo**: Ve a `/admin/home` → sección "Logo de la Empresa" → "Seleccionar Logo"
- **Para productos**: Ve a `/admin/catalogo` → formulario "Agregar Nuevo Producto" → campo "Imagen del Producto"
- **Para redes sociales**: Ve a `/admin/home` → sección "Redes Sociales" → configura Facebook, Instagram, Gmail, YouTube, TikTok
- **Para WhatsApp**: Ve a `/admin/home` → sección "Redes Sociales" → campo "WhatsApp"

### 2. Seleccionar archivos
- Haz clic en "Seleccionar archivo" o "Choose File"
- Elige una imagen PNG, JPG o GIF desde tu computadora
- La imagen se convertirá automáticamente y se guardará

### 3. Vista previa
- Verás una vista previa de la imagen antes de guardar
- Las imágenes se almacenan en el navegador (localStorage)

### 3. Formatos soportados
- PNG, JPG, GIF
- Tamaños recomendados:
  - Logo: máximo 200x100px
  - Productos: 400x300px

### 4. Acceder al admin
- Panel principal: `http://localhost:3000/admin`
- Editar Home: `http://localhost:3000/admin/home`
- Gestionar Catálogo: `http://localhost:3000/admin/catalogo`

### 5. Notas importantes
- Las imágenes se convierten a base64 y se guardan en el navegador
- Si borras el localStorage, perderás las imágenes
- Para producción, necesitarás un backend para almacenar archivos