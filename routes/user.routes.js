const express = require('express');
const router = express.Router();

const {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');

const authMiddleware = require('../middleware/auth');

// 📥 Registro y login públicos
router.post('/', createUser);        // Registro de usuario
router.post('/login', loginUser);    // Login

// 🔒 Rutas protegidas con JWT
router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
