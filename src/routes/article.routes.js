// src/routes/article.routes.js

const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const verifyToken = require('../middleware/auth.middleware');

// POST /api/articles
// Rota para criar um novo artigo. Note que ela é protegida pelo middleware.
router.post('/', verifyToken, articleController.create);

// GET /api/articles - Listar todos os artigos (pública)
router.get('/', articleController.findAll);

// GET /api/articles/:slug - Buscar um artigo pelo seu slug (pública)
router.get('/:slug', articleController.findBySlug);

// PUT /api/articles/:id - Atualizar um artigo (protegida)
router.put('/:id', verifyToken, articleController.update);

// DELETE /api/articles/:id - Deletar um artigo (protegida)
router.delete('/:id', verifyToken, articleController.delete);

router.get('/id/:id', articleController.findById);

module.exports = router;