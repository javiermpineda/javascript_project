// src/helpers/updateData.js
import { doc, updateDoc } from 'firebase/firestore/lite';

import { FirebaseDb } from 'src/firebase/firebaseConfig';

export const updateData = async (path, id, data) => {
  try {
    const docRef = doc(FirebaseDb, path, id);
    await updateDoc(docRef, data);
    console.log('Document successfully updated!');
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};
