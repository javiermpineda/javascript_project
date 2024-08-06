import { getDocs, collection } from 'firebase/firestore/lite';

import { FirebaseDb } from 'src/firebase/firebaseConfig';

export const getData = async (path) => {
  try {
    const querySnapshot = await getDocs(collection(FirebaseDb, path));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
