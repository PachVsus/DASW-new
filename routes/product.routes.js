const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.post('/',     auth, isAdmin, productCtrl.createProduct);
router.put('/:id',   auth, isAdmin, productCtrl.updateProduct);
router.delete('/:id',auth, isAdmin, productCtrl.deleteProduct);

router.post('/', authMiddleware, productController.createProduct);
router.get('/', authMiddleware, productController.getProducts);
router.get('/:id', authMiddleware, productController.getProductById);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;