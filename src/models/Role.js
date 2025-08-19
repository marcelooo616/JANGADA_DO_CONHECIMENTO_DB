// src/models/Role.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // Um Cargo (Role) pode ter vários Usuários
      Role.hasMany(models.User, { foreignKey: 'roleId' });
    }
  }
  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'ROLES'
  });
  return Role;
};