// src/models/Article.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Article = sequelize.define('Article', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  content: {
    type: DataTypes.TEXT, // Usamos TEXT para conteúdos longos
    allowNull: false,
  },
  cover_image_url: {
    type: DataTypes.STRING,
    allowNull: true, // A imagem de capa pode ser opcional
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'), // O status só pode ser um desses valores
    defaultValue: 'draft',
    allowNull: false,
  },
  publication_date: {
    type: DataTypes.DATE,
    allowNull: true, // Só terá valor quando o status for 'published'
  },
  // As colunas 'userId' e 'categoryId' serão criadas pelas associações
}, {
  tableName: 'ARTICLES',
  timestamps: true,
});

module.exports = Article;