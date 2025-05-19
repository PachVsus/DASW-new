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
const isAdmin = require('../middleware/admin'); // ✅ nuevo middleware

// 📥 Registro y login públicos
router.post('/', createUser);
router.post('/login', loginUser);

// 🔒 Rutas protegidas con JWT y rol admin
router.get('/',     authMiddleware, isAdmin, getUsers);     // solo admin
router.get('/:id',  authMiddleware, getUserById);           // usuario logueado puede ver su perfil
router.put('/:id',  authMiddleware, isAdmin, updateUser);   // solo admin
router.delete('/:id', authMiddleware, isAdmin, deleteUser); // solo admin

module.exports = router;
