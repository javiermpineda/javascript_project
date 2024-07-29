import { addDoc,collection } from 'firebase/firestore/lite';

import { FirebaseDb } from 'src/firebase/firebaseConfig';

export const addData = async (path, data) => {
  try {
    const docRef = await addDoc(collection(FirebaseDb, path), data);
    console.log('Document successfully written with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
};
