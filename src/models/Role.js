// src/models/Role.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  // O Sequelize cria o 'id' automaticamente (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
  
  name: {
    type: DataTypes.STRING,
    allowNull: false, // O campo 'name' não pode ser nulo
    unique: true,     // Cada nome de função deve ser único (ex: 'admin', 'author')
  },
  // O Sequelize também cria os campos 'createdAt' e 'updatedAt' automaticamente
}, {
  tableName: 'ROLES', // Força o nome da tabela a ser 'ROLES' em maiúsculas, um padrão comum no Oracle
  timestamps: true, // Habilita os campos createdAt e updatedAt
});

module.exports = Role;