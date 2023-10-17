import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_KEY,
    authDomain: "tetris-1984.firebaseapp.com",
    projectId: "tetris-1984",
    storageBucket: "tetris-1984.appspot.com",
    messagingSenderId: "913565941628",
    appId: "1:913565941628:web:65bc8ee254b9cacc3f2ef9",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
