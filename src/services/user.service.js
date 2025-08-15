const { User, Role } = require('../models');

// Lista todos os usuários
async function findAllUsers() {
  const users = await User.findAll({
    attributes: { exclude: ['password_hash'] }, // Nunca exponha o hash da senha
    include: { model: Role, attributes: ['name'] },
    order: [['full_name', 'ASC']],
  });
  return users;
}

// Atualiza um usuário (usado pelo admin para mudar role ou status)
async function updateUser(id, userData, requestingUser) {
  if (requestingUser.role !== 'admin') {
    throw new Error("Acesso negado. Apenas administradores podem editar usuários.");
  }
  
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error("Usuário não encontrado.");
  }
  
  // Apenas campos permitidos podem ser atualizados por um admin
  const { roleId, IS_ACTIVE } = userData;
  const updateData = {};
  if (roleId !== undefined) updateData.roleId = roleId;
  if (IS_ACTIVE !== undefined) updateData.IS_ACTIVE = IS_ACTIVE;

  return user;
}

module.exports = {
  findAllUsers,
  updateUser,
};