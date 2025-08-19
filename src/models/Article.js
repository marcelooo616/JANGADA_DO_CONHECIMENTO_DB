// src/models/Article.js
'use strict';
const { Model } = require('sequelize');

// O arquivo agora exporta uma função que recebe 'sequelize' e 'DataTypes'
module.exports = (sequelize, DataTypes) => {
  
  // A definição do modelo é feita dentro de uma classe
  class Article extends Model {
    static associate(models) {
      // Aqui definimos as relações que o 'index.js' vai chamar
      Article.belongsTo(models.User, { foreignKey: 'userId' });
      Article.belongsTo(models.Category, { foreignKey: 'categoryId' });
    }
  }
  
  // O 'init' contém a definição das colunas que você já tinha
  Article.init({
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
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cover_image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft',
      allowNull: false,
    },
    publication_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userId: DataTypes.INTEGER,     // As chaves estrangeiras precisam ser definidas aqui
    categoryId: DataTypes.INTEGER, // para que o Sequelize as crie.
  }, {
    sequelize,
    modelName: 'Article',
    tableName: 'ARTICLES' // Garante o nome correto da tabela no Oracle
  });

  return Article;
};