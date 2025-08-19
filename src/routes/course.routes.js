// src/routes/course.routes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');

// Rota para listar todos os cursos
// Ex: GET http://localhost:3000/api/courses
router.get('/', courseController.findAll);

// Rota para buscar um curso específico pelo ID
// Ex: GET http://localhost:3000/api/courses/1
router.get('/:id', courseController.findById);

module.exports = router;