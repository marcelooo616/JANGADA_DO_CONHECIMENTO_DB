// src/services/course.service.js
const { Course, Module, Lesson, User, Category } = require('../models');
const { Op } = require('sequelize');

/**
 * Busca todos os cursos publicados para a página principal.
 */
async function findAllCourses(queryOptions) {
  // 2. Define valores padrão para a paginação
  const page = parseInt(queryOptions.page, 10) || 1;
  const limit = parseInt(queryOptions.limit, 10) || 10;
  const offset = (page - 1) * limit;

  // 3. Constrói a cláusula 'where' dinamicamente
  const whereClause = { status: 'published' };

  if (queryOptions.categoryId) {
    whereClause.categoryId = queryOptions.categoryId;
  }

  if (queryOptions.search) {
    whereClause.title = {
      [Op.like]: `%${queryOptions.search}%` // Busca por parte do título
    };
  }

    // 4. Usa findAndCountAll para obter os dados e a contagem total para a paginação
  const { count, rows } = await Course.findAndCountAll({
    where: whereClause,
    include: [
      { model: User, as: 'instructor', attributes: ['full_name'] },
      { model: Category, attributes: ['name', 'slug'] }
    ],
    order: [['title', 'ASC']],
    limit: limit,
    offset: offset,
  });

  // 5. Retorna um objeto estruturado com os dados da paginação
  return {
    courses: rows,
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
}

/**
 * Busca um curso específico pelo seu ID, com todos os seus módulos e aulas.
 * @param {number} id O ID do curso.
 */
async function findCourseById(id) {
  const course = await Course.findByPk(id, {
    include: [
      { model: User, as: 'instructor', attributes: ['full_name'] },
      { model: Category, attributes: ['name', 'slug'] },
      { // Inclui os módulos associados ao curso
        model: Module,
        as: 'modules',
        // Dentro de cada módulo, inclui as aulas associadas
        include: [{
          model: Lesson,
          as: 'lessons',
          attributes: { exclude: ['content'] } // Exclui o conteúdo pesado da aula na listagem inicial
        }],
      }
    ],
    // Garante que os módulos e as aulas venham na ordem correta
    order: [
      [{ model: Module, as: 'modules' }, 'order', 'ASC'],
      [{ model: Module, as: 'modules' }, { model: Lesson, as: 'lessons' }, 'order', 'ASC']
    ]
  });

  if (!course) {
    throw new Error("Curso não encontrado.");
  }
  return course;
}

module.exports = {
  findAllCourses,
  findCourseById,
};