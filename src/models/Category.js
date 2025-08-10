// src/models/Category.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // ex: 'tecnologia', 'saude' (para URLs amigáveis)
  }
}, {
  tableName: 'CATEGORIES',
  timestamps: true,
});

module.exports = Category;