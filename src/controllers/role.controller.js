// src/controllers/role.controller.js

const roleService = require('../services/role.service');

exports.findAll = async (req, res) => {
  try {
    const roles = await roleService.findAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Erro ao buscar cargos:", error);
    res.status(500).json({ message: "Erro interno ao buscar os cargos." });
  }
};