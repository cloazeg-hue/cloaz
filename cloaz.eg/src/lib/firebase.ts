import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import firebaseConfig from "../../firebase-applet-config.json";

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
// Keep getFirestore as fallback if users do getFirestore(app) somewhere else? No, the singleton is initialized above.
export const rtdb = getDatabase(app, "https://cloaz-16cf0-default-rtdb.firebaseio.com");
export const auth = getAuth(app);
export const storage = getStorage(app);

