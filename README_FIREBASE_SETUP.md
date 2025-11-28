# 🚀 Configuración de Firebase para Tienda Virtual

## ⚠️ Problema Actual
Las imágenes no se cargan porque Firebase no permite lecturas públicas por defecto.

## ✅ Solución: Configurar Reglas de Firestore

### Paso 1: Ir a Firebase Console
1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto: `tiendaarquitectura`
3. Ve a **Firestore Database** → **Reglas**

### Paso 2: Actualizar Reglas
Copia y pega estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura pública para productos y contenido del sitio
    match /products/{document} {
      allow read: if true;
      allow write: if false; // Solo escritura desde servidor/admin
    }

    match /siteContent/{document} {
      allow read: if true;
      allow write: if false; // Solo escritura desde servidor/admin
    }

    // Para desarrollo/testing - permitir todo (cambiar en producción)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Paso 3: Publicar Reglas
1. Click **"Publicar"**
2. Espera a que se actualicen (puede tomar 1-2 minutos)

### Paso 4: Verificar
Una vez publicadas las reglas:
1. Ve a: https://tienda-arquitectura.vercel.app/tienda
2. ✅ **Deberías ver productos desde Firebase**
3. ✅ **Las imágenes subidas deberían aparecer**

## 🔧 Configuración Alternativa (Si no funciona)

Si las reglas no funcionan, puedes usar **localStorage** temporalmente:

```typescript
// En src/lib/products.ts, cambiar getProducts() para usar localStorage
export const getProducts = async (): Promise<Product[]> => {
  // Usar localStorage en lugar de Firebase
  const saved = localStorage.getItem('products');
  return saved ? JSON.parse(saved) : getExampleProducts();
};
```

## 📞 ¿Necesitas Ayuda?

Si después de configurar las reglas aún no funciona:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña **Network**
3. Busca errores relacionados con Firebase
4. Comparte el error específico

¡Las reglas de Firestore son la clave para que funcione la base de datos! 🔑