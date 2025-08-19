// src/models/Category.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // Uma Categoria pode ter vários Artigos e vários Cursos
      Category.hasMany(models.Article, { foreignKey: 'categoryId' });
      Category.hasMany(models.Course, { foreignKey: 'categoryId' });
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'CATEGORIES'
  });
  return Category;
};