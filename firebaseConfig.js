import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore,} from 'firebase/firestore'
import { getStorage,} from 'firebase/storage'


// Your config
const firebaseConfig = {
  apiKey: "AIzaSyDiTqpxP1nLC6F6sIIAHGA9bDZ7oBITf6s",
  authDomain: "mangrow-71e7e.firebaseapp.com",
  projectId: "mangrow-71e7e",
  storageBucket: "mangrow-71e7e.firebasestorage.app",
  messagingSenderId: "466935577638",
  appId: "1:466935577638:web:1039405f5556fc88123ae7",
  measurementId: "G-394N50RB7G"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Export auth
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)