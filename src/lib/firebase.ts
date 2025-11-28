// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGQSprmce5YndpVA-493DP9Hzi14_mq-4",
  authDomain: "tiendaarquitectura.firebaseapp.com",
  projectId: "tiendaarquitectura",
  storageBucket: "tiendaarquitectura.firebasestorage.app",
  messagingSenderId: "667294235066",
  appId: "1:667294235066:web:e15fd3e1bf7335ac750583",
  measurementId: "G-JNPPCRDVCJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;