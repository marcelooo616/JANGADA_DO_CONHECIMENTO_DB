const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyToken = require('../middleware/auth.middleware');

// Todas as rotas de gerenciamento de usuário são protegidas e para admins
router.get('/', verifyToken, userController.findAll);
router.put('/:id', verifyToken, userController.update);

module.exports = router;