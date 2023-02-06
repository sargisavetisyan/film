import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA5a9ExP6oTDdWnubJM30obURUNjpdq47Y",
    authDomain: "film-50aad.firebaseapp.com",
    projectId: "film-50aad",
    storageBucket: "film-50aad.appspot.com",
    messagingSenderId: "282182471476",
    appId: "1:282182471476:web:bf50558a4cebf857ea1f61"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);