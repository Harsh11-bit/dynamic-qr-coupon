import React, { useState } from 'react';
import CouponForm from './components/CouponForm';
import UpdateCouponForm from './components/UpdateCouponForm';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import './App.css';

function App() {
  const [view, setView] = useState('form'); // 'form', 'admin', 'update'
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [couponToUpdate, setCouponToUpdate] = useState(null);

  const handleAdminLogin = () => {
    setAdminAuthenticated(true);
  };

  const handleUpdateClick = (coupon) => {
    setCouponToUpdate(coupon);
    setView('update');
  };

  const handleUpdateSuccess = () => {
    setCouponToUpdate(null);
    setView('admin');
  };

  return (
    <div className="App">
      <header>
        <h1>Dynamic QR Coupon System</h1>
        <nav>
          <button onClick={() => setView('form')}>Coupon Form</button>
          <button onClick={() => setView('admin')}>Admin Panel</button>
        </nav>
      </header>
      <main>
        {view === 'form' && <CouponForm />}
        {view === 'admin' &&
          (!adminAuthenticated ? (
            <AdminLogin onLogin={handleAdminLogin} />
          ) : (
            <AdminPanel onUpdate={handleUpdateClick} />
          ))}
        {view === 'update' && couponToUpdate && (
          <UpdateCouponForm
            coupon={couponToUpdate}
            onUpdateSuccess={handleUpdateSuccess}
            onCancel={() => setView('admin')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
