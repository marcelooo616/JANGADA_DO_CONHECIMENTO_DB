// src/controllers/category.controller.js

const categoryService = require('../services/category.service');

exports.create = async (req, res) => {
  try {
    const requestingUser = { id: req.userId, role: req.userRole };
    const newCategory = await categoryService.createCategory(req.body, requestingUser);
    res.status(201).json(newCategory);
  } catch (error) {
    // Tratamento de erros
    if (error.message.includes("obrigatório")) return res.status(400).json({ message: error.message });
    if (error.message.includes("Acesso negado")) return res.status(403).json({ message: error.message });
    res.status(500).json({ message: "Erro interno ao criar categoria." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const categories = await categoryService.findAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erro interno ao buscar categorias." });
  }
};

exports.update = async (req, res) => {
  try {
    const requestingUser = { id: req.userId, role: req.userRole };
    const updatedCategory = await categoryService.updateCategory(req.params.id, req.body, requestingUser);
    res.status(200).json(updatedCategory);
  } catch (error) {
    // Tratamento de erros
    if (error.message.includes("não encontrada")) return res.status(404).json({ message: error.message });
    if (error.message.includes("Acesso negado")) return res.status(403).json({ message: error.message });
    res.status(500).json({ message: "Erro interno ao atualizar categoria." });
  }
};

exports.delete = async (req, res) => {
  try {
    const requestingUser = { id: req.userId, role: req.userRole };
    await categoryService.deleteCategory(req.params.id, requestingUser);
    res.status(204).send();
  } catch (error) {
    // Tratamento de erros
    if (error.message.includes("não encontrada")) return res.status(404).json({ message: error.message });
    if (error.message.includes("Acesso negado")) return res.status(403).json({ message: error.message });
    res.status(500).json({ message: "Erro interno ao deletar categoria." });
  }
};