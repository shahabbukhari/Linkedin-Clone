// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAOFeTdcAXbM3901IIwk5PXaxNFuoBpKU",
  authDomain: "linkdedin-clone.firebaseapp.com",
  projectId: "linkdedin-clone",
  storageBucket: "linkdedin-clone.appspot.com",
  messagingSenderId: "30687072345",
  appId: "1:30687072345:web:a81eb54aafa6d89145a148",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
function createRef(storage) {
  return (child) => ref(storage, child);
}
const storageRef = createRef(storage);

export { auth, provider, storage, storageRef };
export default db;
