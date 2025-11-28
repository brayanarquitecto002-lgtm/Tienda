# 🚀 Configuración: Firebase + ImgBB (Sistema Híbrido)

## ✅ **Sistema Actual: Firebase Firestore + ImgBB**

Tu tienda virtual ahora usa un **sistema híbrido** que combina lo mejor de ambos mundos:

- **Firebase Firestore**: Para almacenar datos (productos, textos, configuración)
- **ImgBB**: Para almacenar imágenes (servicio gratuito y confiable)

### **Ventajas del Sistema Híbrido:**
- ✅ **Datos estructurados** en Firebase (fácil consulta y backup)
- ✅ **Imágenes gratuitas** en ImgBB (sin costos de storage)
- ✅ **Escalable** - puedes migrar a Firebase Storage cuando crezcas
- ✅ **Confiable** - Firebase para datos críticos, ImgBB para multimedia

## **🔧 Configuración Paso a Paso**

### **1. Configurar Firebase**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita **Firestore Database**
4. Ve a **Project Settings** → **General** → **Your apps**
5. Crea una nueva app web si no tienes una
6. Copia las credenciales de configuración

### **2. Configurar ImgBB**

1. Ve a [ImgBB API](https://api.imgbb.com/)
2. Crea una cuenta gratuita
3. Ve a **API** → **Generate API Key**
4. Copia tu API Key

### **3. Configurar Variables de Entorno**

Edita el archivo `.env.local` en tu proyecto:

```env
# Configuración de ImgBB (OBLIGATORIO)
NEXT_PUBLIC_IMGBB_API_KEY=tu_api_key_de_imgbb_aqui

# Configuración de Firebase (OBLIGATORIO)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_de_firebase
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### **4. Configurar Reglas de Firebase**

En Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura para desarrollo
    // En producción, agrega autenticación
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## **📊 Cómo Funciona**

### **Almacenamiento de Datos:**

| **Tipo de Dato** | **Dónde se guarda** | **Por qué** |
|------------------|-------------------|-------------|
| Productos (texto) | Firebase Firestore | Consultas rápidas, estructura |
| Imágenes productos | ImgBB | Gratuito, CDN global |
| Textos del sitio | Firebase Firestore | Configuración centralizada |
| Logo e imágenes | ImgBB | Optimización de carga |

### **Flujo de Subida de Imágenes:**

1. **Usuario selecciona imagen** → Validación de tamaño/tipo
2. **Compresión automática** → Reduce calidad y tamaño
3. **Subida a ImgBB** → API gratuita devuelve URL directa
4. **URL guardada en Firebase** → Producto completo almacenado
5. **Imagen mostrada** → URL de ImgBB cargada en el sitio

## **🎯 Prueba el Sistema**

### **Subir un Producto:**

1. Ve a `http://localhost:3000/admin/catalogo`
2. Completa nombre, descripción, precio
3. Selecciona imagen (máximo 5MB)
4. Espera la compresión y subida automática
5. Envía el formulario
6. ✅ Producto aparece en la tienda

### **Editar Contenido del Sitio:**

1. Ve a `http://localhost:3000/admin/home`
2. Edita textos (título, descripción, misión, visión)
3. Sube logo o imagen hero
4. ✅ Cambios se reflejan inmediatamente

## **💰 Costos**

| **Servicio** | **Plan** | **Costo** | **Límite** |
|-------------|----------|-----------|------------|
| Firebase Firestore | Spark (Gratis) | $0 | 1GB almacenamiento |
| ImgBB | Gratuito | $0 | 500 imágenes/mes |
| **Total** | **Gratis** | **$0** | Suficiente para empezar |

## **🔄 Migración a Producción**

### **Cuando crezcas:**

1. **Firebase Storage**: Para imágenes (plan Blaze)
2. **Firebase Auth**: Para usuarios administradores
3. **Firebase Hosting**: Para el sitio web

### **Backup de Datos:**

```javascript
// Exportar productos desde Firebase
// Importar productos a Firebase
// Las imágenes en ImgBB se mantienen accesibles
```

## **🚨 Solución de Problemas**

### **Error: "NEXT_PUBLIC_IMGBB_API_KEY is not defined"**
- Verifica que `.env.local` existe y tiene la variable correcta
- Reinicia el servidor de desarrollo

### **Error: "Firebase: Error (auth/invalid-api-key)"**
- Verifica las credenciales de Firebase en `.env.local`
- Asegúrate de que el proyecto de Firebase esté activo

### **Error: "ImgBB API limit exceeded"**
- Has alcanzado el límite gratuito (500 imágenes/mes)
- Espera al siguiente mes o actualiza a plan premium

### **Imágenes no se cargan**
- Verifica conexión a internet
- Revisa que las URLs de ImgBB sean válidas
- Las imágenes de ImgBB tienen URLs permanentes

## **🎉 ¡Listo para Usar!**

Tu tienda virtual ahora tiene:
- ✅ **Base de datos robusta** (Firebase)
- ✅ **Almacenamiento de imágenes gratuito** (ImgBB)
- ✅ **Sistema escalable** para crecimiento futuro
- ✅ **Interfaz de administración completa**

¡Empieza a subir productos y personalizar tu sitio! 🚀