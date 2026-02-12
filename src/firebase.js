import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEguuEbNwep7-Wqz42Cq5Fd8ej1ByQDZg",
  authDomain: "fileteluss-app.firebaseapp.com",
  projectId: "fileteluss-app",
  storageBucket: "fileteluss-app.firebasestorage.app",
  messagingSenderId: "278776264027",
  appId: "1:278776264027:web:1aa6fb2a3d34a2dedf567e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
