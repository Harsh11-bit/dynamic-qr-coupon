// client/src/components/AdminPanel.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = ({ onUpdate }) => {
  const [coupons, setCoupons] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCoupons = async () => {
    setErrorMsg('');
    try {
      const res = await axios.get('/api/coupons');
      setCoupons(res.data);
    } catch (err) {
      console.error('Error fetching coupons:', err.response ? err.response.data : err.message);
      setErrorMsg('Unable to fetch coupons');
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      console.error('Error deleting coupon:', err.response ? err.response.data : err.message);
      setErrorMsg('Unable to delete coupon');
    }
  };

  return (
    <div className="table-container">
      <h2>Admin Panel</h2>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      <table border="1" cellPadding="8" style={{ margin: '0 auto' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Mobile Number</th>
            <th>Flat Number</th>
            <th>Expiration</th>
            <th>Used</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.length > 0 ? (
            coupons.map(({ _id, name, mobileNumber, flatNumber, expireAt, used, createdAt }) => (
              <tr key={_id}>
                <td>{_id}</td>
                <td>{name}</td>
                <td>{mobileNumber}</td>
                <td>{flatNumber}</td>
                <td>{new Date(expireAt).toLocaleString()}</td>
                <td>{used ? 'Yes' : 'No'}</td>
                <td>{new Date(createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="action-button update-button"
                    onClick={() => onUpdate({ _id, name, mobileNumber, flatNumber, expireAt })}
                  >
                    Update
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={() => handleDelete(_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No coupons found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
