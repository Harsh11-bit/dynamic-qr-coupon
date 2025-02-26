import React, { useState } from 'react';
import axios from 'axios';
import QRCodeDisplay from './QRCodeDisplay';

const CouponForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    flatNumber: '',
    expireAt: ''
  });
  const [qrData, setQrData] = useState('');
  const [couponCreated, setCouponCreated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await axios.post('http://localhost:5000/api/coupons', formData);
      setQrData(res.data.qrData);
      setCouponCreated(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || 'Server error');
    }
  };

  return (
    <div className="form-container">
      <h2>Create a Coupon</h2>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={onChange} required />
        </div>
        <div className="form-row">
          <label>Mobile Number:</label>
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={onChange} required />
        </div>
        <div className="form-row">
          <label>Flat Number:</label>
          <input type="text" name="flatNumber" value={formData.flatNumber} onChange={onChange} required />
        </div>
        <div className="form-row">
          <label>Expiration Date:</label>
          <input type="datetime-local" name="expireAt" value={formData.expireAt} onChange={onChange} required />
        </div>
        <button type="submit">Generate QR Code</button>
      </form>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      {couponCreated && (
        <div className="qr-code-container">
          <h3>Your Coupon QR Code</h3>
          <QRCodeDisplay qrData={qrData} />
        </div>
      )}
    </div>
  );
};

export default CouponForm;
