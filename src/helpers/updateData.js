// src/helpers/updateData.js

export const updateData = async (url, data) => {
  console.log('Simulating update operation');
  console.log('URL:', url);
  console.log('Data:', data);

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Update successful (simulated)');
      resolve({ success: true });
    }, 1000); // Simulate a delay
  });
};
