// src/controllers/comment.controller.js

const commentService = require('../services/comment.service');

exports.create = async (req, res) => {
  try {
    const authorId = req.userId; // Do token JWT
    const newComment = await commentService.createComment(req.body, authorId);
    res.status(201).json(newComment);
  } catch (error) {
    if (error.message.includes("obrigatórios")) return res.status(400).json({ message: error.message });
    if (error.message.includes("não encontrado")) return res.status(404).json({ message: error.message });
    res.status(500).json({ message: "Erro interno ao criar comentário." });
  }
};

exports.findAllByArticle = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const comments = await commentService.findCommentsByArticle(articleId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Erro interno ao buscar comentários." });
  }
};
exports.delete = async (req, res) => {
  try {
    const commentId = req.params.id;
    const requestingUser = { id: req.userId, role: req.userRole };

    await commentService.deleteComment(commentId, requestingUser);
    res.status(204).send(); // Sucesso sem conteúdo
  } catch (error) {
    if (error.message.includes("não encontrado")) return res.status(404).json({ message: error.message });
    if (error.message.includes("Acesso negado")) return res.status(403).json({ message: error.message });
    res.status(500).json({ message: "Erro interno ao deletar comentário." });
  }
};