import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: 'AIzaSyAb5NWwK1B2mnYo-g0tkVJMJHpXXTG1Nxg',
  authDomain: 'palosplasticos-e6bd1.firebaseapp.com',
  databaseURL: 'https://palosplasticos-e6bd1-default-rtdb.firebaseio.com',
  projectId: 'palosplasticos-e6bd1',
  storageBucket: 'palosplasticos-e6bd1.appspot.com',
  messagingSenderId: '145692270390',
  appId: '1:145692270390:web:fd32829f4bda711cad5d97',
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);
export const FirebaseDb = getFirestore(FirebaseApp);
