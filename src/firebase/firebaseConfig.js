import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: 'AIzaSyCD7bbPU7Gz7Po4ActBhwZEzLJx6T3nelE',
  authDomain: 'cleaning-73f11.firebaseapp.com',
  projectId: 'cleaning-73f11',
  storageBucket: 'cleaning-73f11.appspot.com',
  messagingSenderId: '104751689312',
  appId: '1:104751689312:web:bb3c6e15af81c007b21d05',
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);
export const FirebaseDb = getFirestore(FirebaseApp);
