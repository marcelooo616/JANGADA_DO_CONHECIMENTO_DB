// src/models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  // id, createdAt, updatedAt são criados automaticamente
  
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
      isEmail: true, // Valida se o formato é de um e-mail
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // A coluna 'roleId' (Foreign Key) será criada automaticamente pela associação abaixo
}, {
  tableName: 'USERS', // Força o nome da tabela a ser 'USERS' em maiúsculas
  timestamps: true,
});

module.exports = User;