// src/services/category.service.js

const { Category } = require('../models');
const slugify = require('slugify');

async function createCategory(categoryData, requestingUser) {
  if (requestingUser.role !== 'admin') {
    throw new Error("Acesso negado. Apenas administradores podem criar categorias.");
  }

  const { name } = categoryData;
  if (!name) {
    throw new Error("O nome da categoria é obrigatório.");
  }

  const slug = slugify(name, { lower: true, strict: true });

  const newCategory = await Category.create({ name, slug });
  return newCategory;
}

async function findAllCategories() {
  const categories = await Category.findAll({ order: [['name', 'ASC']] });
  return categories;
}

async function updateCategory(id, categoryData, requestingUser) {
  if (requestingUser.role !== 'admin') {
    throw new Error("Acesso negado. Apenas administradores podem editar categorias.");
  }

  const category = await Category.findByPk(id);
  if (!category) {
    throw new Error("Categoria não encontrada.");
  }

  const { name } = categoryData;
  if (name) {
    const slug = slugify(name, { lower: true, strict: true });
    await category.update({ name, slug });
  }

  return category;
}

async function deleteCategory(id, requestingUser) {
  if (requestingUser.role !== 'admin') {
    throw new Error("Acesso negado. Apenas administradores podem deletar categorias.");
  }

  const category = await Category.findByPk(id);
  if (!category) {
    throw new Error("Categoria não encontrada.");
  }

  await category.destroy();
}

async function countArticlesByCategoryId(categoryId) {
  // O Sequelize 'count' é otimizado para contar registros
  const count = await Article.count({
    where: {
      categoryId: categoryId,
    },
  });
  // Retornamos um objeto no formato que o front-end espera
  return { count };
}


module.exports = {
  createCategory,
  findAllCategories,
  updateCategory,
  deleteCategory,
  countArticlesByCategoryId,
};