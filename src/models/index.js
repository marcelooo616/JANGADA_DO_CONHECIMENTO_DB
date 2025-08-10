// src/models/index.js

const sequelize = require('../config/database');
const Role = require('./Role');
const User = require('./User');
const Category = require('./Category');
const Article = require('./Article');
const Comment = require('./Comment');

// 1. Define all associations here
// User <-> Role
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

// User <-> Article (Author)
User.hasMany(Article, { foreignKey: 'userId' });
Article.belongsTo(User, { foreignKey: 'userId' });

// Category <-> Article
Category.hasMany(Article, { foreignKey: 'categoryId' });
Article.belongsTo(Category, { foreignKey: 'categoryId' });

// User <-> Comment (Author of Comment)
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

// Article <-> Comment
Article.hasMany(Comment, { foreignKey: 'articleId' });
Comment.belongsTo(Article, { foreignKey: 'articleId' });

// 2. Export everything together
const db = {
  sequelize,
  Role,
  User,
  Category,
  Article,
  Comment,
};

module.exports = db;