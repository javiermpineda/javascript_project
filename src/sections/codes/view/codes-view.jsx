import QRCode from 'qrcode';
import React, { useState } from 'react';

export default function CodesView() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const generateQRCode = async () => {
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value
    };

    try {
      const formDataString = JSON.stringify(formData);
      const url = await QRCode.toDataURL(formDataString);
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form id="myForm">
        <div>
          <input type="text" id="name" name="name" />
        </div>
        <div>
          <input type="email" id="email" name="email" />
        </div>
        <div>
          <input type="text" id="phone" name="phone" />
        </div>
        <button type="button" onClick={generateQRCode}>Generate QR Code</button>
      </form>
      {qrCodeUrl && (
        <div>
          <h3>Generated QR Code:</h3>
          <img src={qrCodeUrl} alt="QR Code" />
        </div>
      )}
    </div>
  );
}
