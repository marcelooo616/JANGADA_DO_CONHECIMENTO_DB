// src/services/role.service.js

const { Role } = require('../models');

/**
 * Busca todos os cargos (roles) do banco de dados.
 * @returns {Promise<Array>} Uma lista de todos os cargos.
 */
async function findAllRoles() {
  const roles = await Role.findAll({
    order: [['name', 'ASC']], // Ordena por nome
  });
  return roles;
}

module.exports = {
  findAllRoles,
};