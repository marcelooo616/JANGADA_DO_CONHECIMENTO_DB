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

  // --- CORREÇÃO: Envolvendo a lógica em uma transação ---
  
  // 1. Inicia uma transação gerenciada pelo Sequelize
  const t = await User.sequelize.transaction();

  try {
    const user = await User.findByPk(id, { transaction: t });
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const { roleId, IS_ACTIVE } = userData;
    const updateData = {};
    if (roleId !== undefined) updateData.roleId = roleId;
    if (IS_ACTIVE !== undefined) updateData.IS_ACTIVE = IS_ACTIVE;

    // 2. Executa o update DENTRO da transação
    await user.update(updateData, { transaction: t });

    // 3. O PASSO MAIS IMPORTANTE: Salva permanentemente as alterações no banco
    await t.commit();

    return user; // Retorna o usuário atualizado

  } catch (error) {
    // 4. Se qualquer erro acontecer, desfaz todas as alterações
    await t.rollback();
    // Lança o erro para que o controller possa pegá-lo
    throw error; 
  }
}
module.exports = {
  findAllUsers,
  updateUser,
};