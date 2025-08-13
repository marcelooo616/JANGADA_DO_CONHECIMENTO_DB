// src/services/article.service.js

const Article = require('../models/Article');
const slugify = require('slugify');
const User = require('../models/User');        
const Category = require('../models/Category');
const { Op } = require('sequelize');

async function createArticle(articleData, requestingUser) {
  // Lógica de Autorização: Só admins podem criar artigos
  if (requestingUser.role !== 'admin') {
    throw new Error("Acesso negado. Apenas administradores podem publicar artigos.");
  }

  const { title, content, categoryId, cover_image_url } = articleData;

  if (!title || !content || !categoryId) {
    throw new Error("Título, conteúdo e categoria são obrigatórios.");
  }

  const slug = slugify(title, { lower: true, strict: true });

  const newArticle = await Article.create({
    title,
    slug,
    content,
    categoryId,
    cover_image_url,
    userId: requestingUser.id, // Ainda salvamos o ID de quem criou
    status: 'published',
    publication_date: new Date()
  });

  return newArticle;
}

// src/services/article.service.js

// ... (depois da linha do 'require' que você adicionou)

async function findAllArticles(queryOptions) {
  // Define valores padrão para a paginação
  const page = parseInt(queryOptions.page, 10) || 1;
  const limit = parseInt(queryOptions.limit, 10) || 10;
  const offset = (page - 1) * limit;

  // --- AQUI COMEÇA A CORREÇÃO ---

  // 1. Começamos com uma cláusula 'where' base que sempre se aplica
  const whereClause = { status: 'published' };

  // 2. Adicionamos o filtro de categoria, se ele existir na query
  if (queryOptions.categoryId) {
    whereClause.categoryId = queryOptions.categoryId;
  }

  // 3. Adicionamos o filtro de busca (search), se ele existir
  if (queryOptions.search) {
    const searchTerm = queryOptions.search;
    // Usamos Op.or para buscar no título OU no conteúdo
    whereClause[Op.or] = [
      {
        title: {
          [Op.like]: `%${searchTerm}%` // Procura o termo em qualquer parte do título
        }
      },
      {
        content: {
          [Op.like]: `%${searchTerm}%` // Procura o termo em qualquer parte do conteúdo
        }
      }
    ];
  }

  // 4. Usamos a cláusula 'where' dinâmica na nossa busca
  const { count, rows } = await Article.findAndCountAll({
    where: whereClause, // <<-- MUDANÇA PRINCIPAL AQUI
    order: [['publication_date', 'DESC']],
    attributes: { exclude: ['content', 'updatedAt'] }, // Mantemos a exclusão do conteúdo na listagem
    include: [
      { model: User, attributes: ['full_name', 'username'] },
      { model: Category, attributes: ['name', 'slug'] }
    ],
    limit: limit,
    offset: offset,
  });

  return {
    articles: rows,
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
}

// ... (resto do seu arquivo article.service.js)

async function findArticleBySlug(slug) {
  const article = await Article.findOne({
    // Condições da busca
    where: { 
      slug: slug,
      status: 'published' 
    },
    // Desta vez, NÃO excluímos o 'content'
    include: [
      {
        model: User,
        attributes: ['full_name', 'username']
      },
      {
        model: Category,
        attributes: ['name', 'slug']
      }
    ]
  });

  if (!article) {
    throw new Error("Artigo não encontrado.");
  }

  return article;
}

async function findArticleById(id) {
  const article = await Article.findByPk(id, {
    include: [{ model: User }, { model: Category }]
  });
  if (!article) throw new Error("Artigo não encontrado.");
  return article;
}


async function updateArticle(id, articleData, requestingUser) {
  if (requestingUser.role !== 'admin') {
    throw new Error("Acesso negado. Você não tem permissão para editar este artigo.");
  }
  
  // Usamos findByPk (Find by Primary Key), que é otimizado para buscar por ID
  const article = await Article.findByPk(id); // <<-- MUDOU DE findOne PARA findByPk

  if (!article) {
    throw new Error("Artigo não encontrado.");
  }
  
  // Se o título mudar, geramos um novo slug
  if (articleData.title) {
    articleData.slug = slugify(articleData.title, { lower: true, strict: true });
  }

  const updatedArticle = await article.update(articleData);

  return updatedArticle;
}


async function deleteArticle(id, requestingUser) { // <<-- MUDOU DE slug PARA id
  if (requestingUser.role !== 'admin') {
    throw new Error("Acesso negado. Você não tem permissão para deletar este artigo.");
  }

  const article = await Article.findByPk(id); // <<-- MUDOU DE findOne PARA findByPk

  if (!article) {
    throw new Error("Artigo não encontrado.");
  }
  
  await article.destroy();
}

module.exports = {
  createArticle,
  updateArticle,
  findAllArticles,
  findArticleBySlug,
  deleteArticle,
  findArticleById,
};