// src/controllers/course.controller.js
const courseService = require('../services/course.service');

// Lida com a requisição para listar todos os cursos
exports.findAll = async (req, res) => {
  try {
    // Passa o objeto req.query (que contém page, limit, etc.) para o serviço
    const coursesData = await courseService.findAllCourses(req.query);
    res.status(200).json(coursesData);
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    res.status(500).json({ message: "Erro interno ao buscar cursos." });
  }
};

// Lida com a requisição para buscar um curso por ID
exports.findById = async (req, res) => {
  try {
    const course = await courseService.findCourseById(req.params.id);
    res.status(200).json(course);
  } catch (error) {
    if (error.message.includes("não encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    console.error("Erro ao buscar curso por ID:", error);
    res.status(500).json({ message: "Erro interno ao buscar o curso." });
  }
};