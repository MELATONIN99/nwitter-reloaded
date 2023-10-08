import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDFtGWzt8-CeihQMzGcMxd0dRv8KPOv4VE",
  authDomain: "nwitter-reloaded-677ed.firebaseapp.com",
  projectId: "nwitter-reloaded-677ed",
  storageBucket: "nwitter-reloaded-677ed.appspot.com",
  messagingSenderId: "512760158328",
  appId: "1:512760158328:web:71ec7ffc437660e12d358d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
