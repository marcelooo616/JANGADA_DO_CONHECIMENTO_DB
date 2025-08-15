const userService = require('../services/user.service');

exports.findAll = async (req, res) => {
  try {
    const users = await userService.findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro interno ao buscar usuários." });
  }
};

exports.update = async (req, res) => {
  try {
    const requestingUser = { id: req.userId, role: req.userRole };
    const updatedUser = await userService.updateUser(req.params.id, req.body, requestingUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.message.includes("não encontrado")) return res.status(404).json({ message: error.message });
    if (error.message.includes("Acesso negado")) return res.status(403).json({ message: error.message });
    res.status(500).json({ message: "Erro interno ao atualizar usuário." });
  }
};