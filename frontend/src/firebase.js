// Import the necessary Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFXBKYGzoPovg30Rq4xv7qdaBnaoDl678",
  authDomain: "blogapp-f8e9b.firebaseapp.com",
  projectId: "blogapp-f8e9b",
  storageBucket: "blogapp-f8e9b.firebasestorage.app",
  messagingSenderId: "1038298409334",
  appId: "1:1038298409334:web:209df94723981730da7257",
  measurementId: "G-936D4HL9X7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
