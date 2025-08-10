// src/models/Comment.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // As colunas 'userId' e 'articleId' serão criadas pelas associações
}, {
  tableName: 'COMMENTS',
  timestamps: true,
});

module.exports = Comment;