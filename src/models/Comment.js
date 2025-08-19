// src/models/Comment.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // Um Comentário pertence a um Usuário e a um Artigo
      Comment.belongsTo(models.User, { foreignKey: 'userId' });
      Comment.belongsTo(models.Article, { foreignKey: 'articleId' });
    }
  }
  Comment.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: DataTypes.INTEGER,    // Chave estrangeira
    articleId: DataTypes.INTEGER, // Chave estrangeira
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'COMMENTS'
  });
  return Comment;
};