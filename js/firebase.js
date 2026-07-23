import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAumbNhqm-VMarTZlomTftyvtrJA8sABt8",
    authDomain: "control-acceso-5fcc2-a626f.firebaseapp.com",
    projectId: "control-acceso-5fcc2-a626f",
    storageBucket: "control-acceso-5fcc2-a626f.firebasestorage.app",
    messagingSenderId: "344990560983",
    appId: "1:344990560983:web:ca9704630a8c141d24f692",
    measurementId: "G-64LLFFQYBB"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };