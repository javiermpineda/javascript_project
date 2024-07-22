import { getDocs, collection } from 'firebase/firestore/lite';

import { FirebaseDb } from 'src/firebase/firebaseConfig';

export const getData = async (path) => {
  const querySnapshot = await getDocs(collection(FirebaseDb, `${path}`));

  try {
    const data = [];

    querySnapshot.forEach((doc) =>
      data.push({
        id: doc.id,

        ...doc.data(),
      })
    );

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);

    throw error;
  }
};
