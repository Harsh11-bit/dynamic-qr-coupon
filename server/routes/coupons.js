const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// Helper function to render coupon status (redemption page) WITHOUT expiration date display
const renderCouponResponse = (coupon, message, color) => {
  return `
    <div style="max-width:600px; margin:40px auto; padding:30px; border-radius:10px; background:#fff; 
      box-shadow:0 4px 10px rgba(0,0,0,0.1); text-align:center;">
      <h1 style="color:${color};">${message}</h1>
      <div style="text-align:left; margin-top:20px;">
        <h2 style="border-bottom:1px solid #ddd; padding-bottom:10px;">Coupon Details</h2>
        <p><strong>Name:</strong> ${coupon.name || '—'}</p>
        <p><strong>Mobile Number:</strong> ${coupon.mobileNumber || '—'}</p>
        <p><strong>Flat Number:</strong> ${coupon.flatNumber || '—'}</p>
      </div>
    </div>
  `;
};

// POST /api/coupons - Create a new coupon and return QR code data
router.post('/', async (req, res) => {
  try {
    const { name, mobileNumber, flatNumber, expireAt } = req.body;
    if (!name || !mobileNumber || !flatNumber || !expireAt) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }

    const coupon = new Coupon({
      name,
      mobileNumber,
      flatNumber,
      expireAt: new Date(expireAt)
    });
    await coupon.save();

    // Generate QR code URL using current host (or EXTERNAL_HOST env var)
    const EXTERNAL_HOST = process.env.EXTERNAL_HOST || req.get('host');
    const qrData = `${req.protocol}://${EXTERNAL_HOST}/api/coupons/redeem/${coupon._id}`;
    res.json({ coupon, qrData });
  } catch (err) {
    console.error('Error creating coupon:', err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/coupons/redeem/:id - Redeem coupon (redemption page)
router.get('/redeem/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.send(renderCouponResponse({}, 'Coupon not found', 'red'));
    }
    if (coupon.used) {
      return res.send(renderCouponResponse(coupon, 'Coupon already used', 'red'));
    }
    if (new Date() > coupon.expireAt) {
      return res.send(renderCouponResponse(coupon, 'Coupon expired', 'red'));
    }
    coupon.used = true;
    await coupon.save();
    return res.send(renderCouponResponse(coupon, 'Coupon Applied Successfully', 'green'));
  } catch (err) {
    console.error('Error redeeming coupon:', err.message);
    return res.send(renderCouponResponse({}, 'Error applying coupon', 'red'));
  }
});

// GET /api/coupons/:id - Fetch coupon details (for admin)
router.get('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ msg: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (err) {
    console.error('Error fetching coupon:', err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/coupons - Return all coupons (for admin panel)
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    console.error('Error fetching coupons:', err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/coupons/:id - Update coupon details
router.put('/:id', async (req, res) => {
  try {
    const { name, mobileNumber, flatNumber, expireAt } = req.body;
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { name, mobileNumber, flatNumber, expireAt: new Date(expireAt) },
      { new: true }
    );
    if (!coupon) {
      return res.status(404).json({ msg: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (err) {
    console.error('Error updating coupon:', err.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/coupons/:id - Delete a coupon
router.delete('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ msg: 'Coupon not found' });
    }
    res.json({ msg: 'Coupon deleted successfully' });
  } catch (err) {
    console.error('Error deleting coupon:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
