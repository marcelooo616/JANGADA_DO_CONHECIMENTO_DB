// src/routes/upload.routes.js
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const uploadMiddleware = require('../config/multer');
const verifyToken = require('../middleware/auth.middleware');

// A rota será POST /api/upload-image
// Protegida por token e usando o multer para processar um único arquivo chamado 'file'
router.post('/upload-image', [verifyToken, uploadMiddleware.single('file')], uploadController.uploadImage);

module.exports = router;