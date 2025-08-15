// src/routes/role.routes.js

const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const verifyToken = require('../middleware/auth.middleware');

// A rota para buscar todos os cargos será protegida,
// pois apenas um admin logado precisa dela.
router.get('/', verifyToken, roleController.findAll);

module.exports = router;