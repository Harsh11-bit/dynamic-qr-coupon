import React, { useState } from 'react';
import axios from 'axios';

const UpdateCouponForm = ({ coupon, onUpdateSuccess, onCancel }) => {
  // Format the expiration date for datetime-local input
  const formattedExpireAt = new Date(coupon.expireAt).toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    name: coupon.name,
    mobileNumber: coupon.mobileNumber,
    flatNumber: coupon.flatNumber,
    expireAt: formattedExpireAt
  });
  const [errorMsg, setErrorMsg] = useState('');

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await axios.put(`http://localhost:5000/api/coupons/${coupon._id}`, formData);
      onUpdateSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || 'Server error');
    }
  };

  return (
    <div className="form-container">
      <h2>Update Coupon</h2>
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
        <button type="submit">Update Coupon</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </form>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
  );
};

export default UpdateCouponForm;
