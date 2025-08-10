// src/routes/category.routes.js

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const verifyToken = require('../middleware/auth.middleware');

// Rotas Públicas
router.get('/', categoryController.findAll);

// Rotas Protegidas (Apenas Admins)
router.post('/', verifyToken, categoryController.create);
router.put('/:id', verifyToken, categoryController.update);
router.delete('/:id', verifyToken, categoryController.delete);

module.exports = router;