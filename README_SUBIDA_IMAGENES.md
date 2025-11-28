# 🔧 Guía para Solucionar Problemas de Subida de Imágenes

## Problema: "No puedo subir imágenes al catálogo"

Si tienes problemas para subir imágenes en el panel de administración, sigue estos pasos:

### 1. **Verificar Configuración de Firebase**

Asegúrate de que tu proyecto de Firebase tenga las reglas correctas:

#### **Firestore Rules** (Database → Rules):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Para desarrollo - cambiar en producción
    }
  }
}
```

#### **Storage Rules** (Storage → Rules):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // Para desarrollo - cambiar en producción
    }
  }
}
```

### 2. **Proceso Correcto para Subir Imágenes**

1. Ve a `http://localhost:3000/admin/catalogo`
2. En "Agregar Nuevo Producto", selecciona una imagen
3. **Espera** a que aparezca el mensaje "Imagen subida exitosamente" y la vista previa
4. Completa los demás campos (nombre, descripción, precio, etc.)
5. Haz clic en "Agregar Producto"

### 3. **Verificar en Consola del Navegador**

Abre las herramientas de desarrollo (F12) y ve a la pestaña Console. Deberías ver mensajes como:
```
Iniciando subida de imagen: imagen.jpg 1024000 bytes
Creando referencia de storage: products/123456789/imagen.jpg
Subiendo bytes...
Obteniendo URL de descarga...
URL obtenida: https://firebasestorage.googleapis.com/...
Imagen subida exitosamente
```

### 4. **Posibles Problemas y Soluciones**

#### **Error: "Firebase: Error (auth/invalid-api-key)"**
- Verifica que las credenciales en `src/lib/firebase.ts` sean correctas
- Asegúrate de que el proyecto de Firebase esté activo

#### **Error: "Firebase: Missing or insufficient permissions"**
- Revisa las reglas de Storage (punto 1 arriba)
- Las reglas deben permitir escritura para desarrollo

#### **Error: "CORS policy"**
- Firebase Storage debería manejar CORS automáticamente
- Si persiste, verifica la configuración del bucket

#### **Imagen no se sube automáticamente**
- Asegúrate de seleccionar un archivo válido (PNG, JPG, GIF)
- Verifica que el archivo no sea demasiado grande (< 10MB)
- Espera a que termine la subida antes de enviar el formulario

### 5. **Probar con Imagen de Prueba**

1. Crea una imagen pequeña (100x100px) en Paint o similar
2. Guárdala como `test.jpg`
3. Intenta subirla en el catálogo
4. Si funciona, el problema era el tamaño/archivo original

### 6. **Debugging Avanzado**

Si los problemas persisten:

1. **Revisa las reglas de Firebase:**
   - Ve a Firebase Console → Storage → Rules
   - Asegúrate de que estén actualizadas

2. **Verifica la conexión a internet:**
   - Firebase requiere conexión para subir imágenes

3. **Prueba en modo incógnito:**
   - Elimina posibles extensiones del navegador que interfieran

4. **Revisa las dependencias:**
   ```bash
   cd tienda-arquitectura
   npm install
   npm run dev
   ```

### 7. **Configuración de Producción**

Cuando subas a producción, cambia las reglas de Firebase:

#### **Firestore Rules (Producción):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // Solo usuarios autenticados
    }
    match /siteContent/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### **Storage Rules (Producción):**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /site/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 8. **Soporte**

Si después de seguir estos pasos aún tienes problemas:

1. Copia los errores de la consola del navegador
2. Revisa las reglas de Firebase
3. Verifica que las credenciales sean correctas

Los logs detallados en la consola te ayudarán a identificar exactamente dónde está fallando el proceso.