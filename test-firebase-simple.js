// Test simple de Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCGQSprmce5YndpVA-493DP9Hzi14_mq-4",
  authDomain: "tiendaarquitectura.firebaseapp.com",
  projectId: "tiendaarquitectura",
  storageBucket: "tiendaarquitectura.firebasestorage.app",
  messagingSenderId: "667294235066",
  appId: "1:667294235066:web:e15fd3e1bf7335ac750583",
  measurementId: "G-JNPPCRDVCJ"
};

console.log('🔥 Probando Firebase con config real...');
console.log('📍 Project ID:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    console.log('📖 Intentando leer colección "products"...');
    const querySnapshot = await getDocs(collection(db, 'products'));
    console.log('✅ Éxito! Productos encontrados:', querySnapshot.size);

    querySnapshot.forEach((doc) => {
      console.log('📦', doc.id, ':', doc.data().name);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();