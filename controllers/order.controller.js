const Order   = require('../models/order.model');
const Product = require('../models/product.model');

exports.createOrder = async (req, res) => {
  try {
    const items = req.body.items; // [{product, qty}]
    if (!items?.length) return res.status(400).json({ error: 'Items required' });

    // calcular total
    const products = await Product.find({ _id: { $in: items.map(i => i.product) } });
    const total = items.reduce((sum, it) => {
      const p = products.find(pr => pr._id.equals(it.product));
      return sum + (p.price * it.qty);
    }, 0);

    const order = await Order.create({ user: req.user.id, items, total });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate('items.product');
  res.json(orders);
};

/* --- Endpoints admin --- */
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'email').populate('items.product');
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body; // 'paid' | 'shipped'
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.json(order);
};
