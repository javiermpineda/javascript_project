// src/helpers/deleteData.js
import { doc, deleteDoc } from 'firebase/firestore/lite';

import { FirebaseDb } from 'src/firebase/firebaseConfig';

export const deleteData = async (path, id) => {
  try {
    const docRef = doc(FirebaseDb, path, id);
    await deleteDoc(docRef);
    console.log('Document successfully deleted!');
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};