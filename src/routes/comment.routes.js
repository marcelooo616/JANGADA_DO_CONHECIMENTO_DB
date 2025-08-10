// src/routes/comment.routes.js

const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const verifyToken = require('../middleware/auth.middleware');

// POST /api/comments - Criar um novo comentário (protegida)
router.post('/', verifyToken, commentController.create);

// GET /api/comments/article/:articleId - Listar comentários de um artigo (pública)
router.get('/article/:articleId', commentController.findAllByArticle);

// DELETE /api/comments/:id - Deletar um comentário (protegida)
router.delete('/:id', verifyToken, commentController.delete);

module.exports = router;