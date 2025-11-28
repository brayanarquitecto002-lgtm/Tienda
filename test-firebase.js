// Script de prueba para Firebase + ImgBB
// Ejecuta con: node test-firebase.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

// Configuración de Firebase (reemplaza con tus valores)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo_key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirebaseConnection() {
  console.log('🔥 Probando conexión a Firebase...');

  try {
    // Probar escritura
    console.log('📝 Probando escritura en Firestore...');
    const docRef = await addDoc(collection(db, 'test'), {
      message: 'Test connection',
      timestamp: new Date(),
      source: 'test-script'
    });
    console.log('✅ Escritura exitosa. Document ID:', docRef.id);

    // Probar lectura
    console.log('📖 Probando lectura desde Firestore...');
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('✅ Lectura exitosa. Documentos encontrados:', querySnapshot.size);

    console.log('🎉 ¡Firebase está funcionando correctamente!');

  } catch (error) {
    console.error('❌ Error en Firebase:', error.message);
    console.log('💡 Posibles soluciones:');
    console.log('   1. Verifica las credenciales en .env.local');
    console.log('   2. Asegúrate de que Firestore esté habilitado');
    console.log('   3. Revisa las reglas de Firestore');
  }
}

async function testImgBBConnection() {
  console.log('🖼️ Probando conexión a ImgBB...');

  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!IMGBB_API_KEY || IMGBB_API_KEY === 'TU_API_KEY_AQUI') {
    console.log('⚠️ ImgBB API Key no configurada. Ve a .env.local y configura NEXT_PUBLIC_IMGBB_API_KEY');
    return;
  }

  try {
    // Crear una imagen de prueba pequeña (1x1 pixel transparente)
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    const formData = new FormData();
    formData.append('image', testImage);

    console.log('📤 Enviando imagen de prueba a ImgBB...');
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success) {
      console.log('✅ ImgBB funcionando correctamente!');
      console.log('🔗 URL de prueba:', data.data.url);
    } else {
      throw new Error('Respuesta de error de ImgBB');
    }

  } catch (error) {
    console.error('❌ Error en ImgBB:', error.message);
    console.log('💡 Posibles soluciones:');
    console.log('   1. Verifica tu API Key de ImgBB');
    console.log('   2. Asegúrate de tener conexión a internet');
    console.log('   3. Revisa si has excedido el límite gratuito (500 imágenes/mes)');
  }
}

async function runTests() {
  console.log('🚀 Iniciando pruebas del sistema...\n');

  await testFirebaseConnection();
  console.log('\n' + '='.repeat(50) + '\n');
  await testImgBBConnection();

  console.log('\n✨ Pruebas completadas!');
  console.log('💡 Si ambas pruebas pasaron, tu tienda virtual está lista para usar.');
}

// Ejecutar pruebas
runTests().catch(console.error);