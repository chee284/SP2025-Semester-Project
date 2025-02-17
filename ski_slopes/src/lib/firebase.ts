// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAol5d43-x1GzAyQH2ubFIxCqX4QX_YCAM",
    authDomain: "ski-slopes-14677.firebaseapp.com",
    projectId: "ski-slopes-14677",
    storageBucket: "ski-slopes-14677.firebasestorage.app",
    messagingSenderId: "96265140293",
    appId: "1:96265140293:web:90863eace98916f6540b2c",
    measurementId: "G-6Q3SJLXGZ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };