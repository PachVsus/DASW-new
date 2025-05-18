const router     = require('express').Router();
const auth       = require('../middleware/auth');
const isAdmin    = require('../middleware/isAdmin');
const orderCtrl  = require('../controllers/order.controller');

/* ----- cliente ----- */
router.post('/',              auth, orderCtrl.createOrder);
router.get('/me',             auth, orderCtrl.getMyOrders);

/* ----- admin ----- */
router.get('/',               auth, isAdmin, orderCtrl.getAllOrders);
router.patch('/:id/status',   auth, isAdmin, orderCtrl.updateOrderStatus);

module.exports = router;
