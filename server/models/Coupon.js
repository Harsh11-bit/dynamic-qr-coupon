// server/models/Coupon.js
const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  flatNumber: { type: String, required: true },
  expireAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Optional: Use TTL index if you want to auto-remove expired coupons
// CouponSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Coupon', CouponSchema);
