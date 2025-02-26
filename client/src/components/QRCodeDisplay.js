// client/src/components/QRCodeDisplay.js
import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeDisplay = ({ qrData }) => {
  return (
    <div style={{ background: 'white', padding: '16px', display: 'inline-block' }}>
      {qrData ? <QRCode value={qrData} size={256} /> : <p>No QR data available.</p>}
    </div>
  );
};

export default QRCodeDisplay;
