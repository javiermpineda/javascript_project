// src/helpers/deleteData.js

export const deleteData = async (url) => {
    console.log('Simulating delete operation');
    console.log('URL:', url);
  
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Delete successful (simulated)');
        resolve({ success: true });
      }, 1000); // Simulate a delay
    });
  };
  