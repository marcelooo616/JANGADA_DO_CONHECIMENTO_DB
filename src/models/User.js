// src/models/User.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // RELAÇÕES:
      // Um Usuário pertence a um Cargo (Role)
      User.belongsTo(models.Role, { foreignKey: 'roleId' });
      // Um Usuário pode ter vários Artigos
      User.hasMany(models.Article, { foreignKey: 'userId' });
      // Um Usuário pode ter vários Cursos (como instrutor)
      User.hasMany(models.Course, { foreignKey: 'userId', as: 'instructorCourses' });
      // Um Usuário pode ter vários Comentários
      User.hasMany(models.Comment, { foreignKey: 'userId' });
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    IS_ACTIVE: { // Mantendo o nome em maiúsculas para consistência com o Oracle
      type: DataTypes.INTEGER, // Usando INTEGER para representar 0 ou 1
      allowNull: false,
      defaultValue: 1,
      validate: {
        isIn: [[0, 1]]
      }
    },
    roleId: DataTypes.INTEGER // Chave estrangeira
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'USERS' // Garante o nome da tabela em maiúsculas
  });
  return User;
};