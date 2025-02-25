// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    razorpayOrderId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    receipt: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'created',
    },
    // Optionally, add fields for payment details after completion
    paymentId: {
      type: String,
    },
    signature: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
