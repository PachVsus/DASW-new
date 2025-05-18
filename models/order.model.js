const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        qty    : { type: Number, required: true, min: 1 }
      }
    ],
    status: { type: String, enum: ['pending', 'paid', 'shipped'], default: 'pending' },
    total : { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
