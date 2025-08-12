// src/controllers/article.controller.js

const articleService = require('../services/article.service');

exports.create = async (req, res) => {
  try {
    // Passamos o objeto de usuário inteiro para o serviço poder checar a 'role'
    const requestingUser = { id: req.userId, role: req.userRole };
    const articleData = req.body;

    const newArticle = await articleService.createArticle(articleData, requestingUser);

    res.status(201).json(newArticle);

  } catch (error) {
    if (error.message.includes("obrigatórios")) {
      return res.status(400).json({ message: error.message });
    }
    // Agora também capturamos o erro de permissão do serviço
    if (error.message.includes("Acesso negado")) {
      return res.status(403).json({ message: error.message });
    }
    console.error("Erro ao criar artigo:", error);
    res.status(500).json({ message: "Erro interno ao criar o artigo." });
  }
};
exports.findAll = async (req, res) => {
  try {
    // A query vem de req.query (ex: /articles?page=2&limit=5)
    const articlesData = await articleService.findAllArticles(req.query);
    res.status(200).json(articlesData);
  } catch (error) {
    console.error("Erro ao buscar artigos:", error);
    res.status(500).json({ message: "Erro interno ao buscar os artigos." });
  }
};

exports.findBySlug = async (req, res) => {
  try {
    // O slug vem dos parâmetros da rota (ex: /articles/meu-artigo)
    const slug = req.params.slug;
    const article = await articleService.findArticleBySlug(slug);
    res.status(200).json(article);
  } catch (error) {
    if (error.message.includes("não encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    console.error("Erro ao buscar artigo pelo slug:", error);
    res.status(500).json({ message: "Erro interno ao buscar o artigo." });
  }
};

exports.update = async (req, res) => {
  try {
    const articleId = req.params.id; //
    const articleData = req.body;
    const requestingUser = { id: req.userId, role: req.userRole };

    const updatedArticle = await articleService.updateArticle(articleId, articleData, requestingUser);

    res.status(200).json(updatedArticle);

  } catch (error) {
    if (error.message.includes("não encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("Acesso negado")) {
      return res.status(403).json({ message: error.message }); // 403 Forbidden
    }
    console.error("Erro ao atualizar artigo:", error);
    res.status(500).json({ message: "Erro interno ao atualizar o artigo." });
  }
};

exports.findById = async (req, res) => {
  try {
    const article = await articleService.findArticleById(req.params.id);
    res.status(200).json(article);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const articleId = req.params.id; // 
    const requestingUser = { id: req.userId, role: req.userRole };

    await articleService.deleteArticle(articleId, requestingUser);

    // 204 No Content é o status padrão para deleção bem-sucedida
    res.status(204).send();

  } catch (error) {
    if (error.message.includes("não encontrado")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("Acesso negado")) {
      return res.status(403).json({ message: error.message });
    }
    console.error("Erro ao deletar artigo:", error);
    res.status(500).json({ message: "Erro interno ao deletar o artigo." });
  }
};