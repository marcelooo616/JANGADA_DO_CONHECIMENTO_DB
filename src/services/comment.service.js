// src/services/comment.service.js

const { Comment, User, Article } = require('../models');

// Cria um novo comentário
async function createComment(commentData, authorId) {
  const { content, articleId } = commentData;

  if (!content || !articleId) {
    throw new Error("Conteúdo e ID do artigo são obrigatórios.");
  }

  // Verifica se o artigo existe antes de comentar
  const article = await Article.findByPk(articleId);
  if (!article) {
    throw new Error("Artigo não encontrado.");
  }

  const newComment = await Comment.create({
    content,
    articleId,
    userId: authorId,
  });

  return newComment;
}

// Busca todos os comentários de um artigo específico
async function findCommentsByArticle(articleId) {
  const comments = await Comment.findAll({
    where: { articleId: articleId },
    order: [['createdAt', 'ASC']], // Ordena do mais antigo para o mais novo
    include: {
      model: User,
      attributes: ['id', 'full_name', 'username'] // Inclui dados do autor do comentário
    }
  });

  return comments;
}

async function deleteComment(commentId, requestingUser) {
  // 1. Encontra o comentário a ser deletado
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new Error("Comentário não encontrado.");
  }

  // 2. Lógica de Autorização
  const isAuthor = comment.userId === requestingUser.id;
  const isAdmin = requestingUser.role === 'admin';

  if (!isAuthor && !isAdmin) {
    throw new Error("Acesso negado. Você não tem permissão para deletar este comentário.");
  }

  // 3. Se a permissão for concedida, deleta o comentário
  await comment.destroy();
}

module.exports = {
  createComment,
  findCommentsByArticle,
  deleteComment, // <<-- Exporte a nova função
};