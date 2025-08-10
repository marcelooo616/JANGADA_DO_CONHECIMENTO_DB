// src/routes/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth.middleware');

// Rota para registrar um novo usuário
// POST /api/auth/register
router.post('/register', authController.register);
router.post('/login', authController.login);
// No futuro, aqui também teremos a rota de login:
// router.post('/login', authController.login);


router.get('/me', verifyToken, (req, res) => {
  // Graças ao middleware 'verifyToken', agora temos acesso a 'req.userId'
  // No futuro, podemos pegar esse ID e buscar as informações completas do usuário no banco
  res.status(200).json({
    message: "Token válido!",
    userId: req.userId,
    userRole: req.userRole
  });
});

module.exports = router;