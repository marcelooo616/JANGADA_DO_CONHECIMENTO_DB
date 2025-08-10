// src/services/auth.service.js

const { User, Role } = require('../models'); // <-- CHANGE THIS

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// A função do serviço recebe os dados puros, não req e res
async function registerUser(userData) {
  const { full_name, username, email, password } = userData;

  // Validações que pertencem à regra de negócio
  if (!full_name || !username || !email || !password) {
    // Em vez de res.status, nós lançamos um erro que o controller vai pegar
    throw new Error("Por favor, preencha todos os campos.");
  }

  const userExists = await User.findOne({ where: { email: email } });
  if (userExists) {
    throw new Error("Este e-mail já está em uso.");
  }

  const usernameExists = await User.findOne({ where: { username: username } });
  if (usernameExists) {
    throw new Error("Este nome de usuário já está em uso.");
  }

  // Lógica de negócio principal
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const [role] = await Role.findOrCreate({
    where: { name: 'author' },
  });

  const newUser = await User.create({
    full_name,
    username,
    email,
    password_hash,
    roleId: role.id
  });

  // O serviço retorna os dados brutos, sem se preocupar com o formato da resposta HTTP
  return newUser;
}


async function loginUser(loginData) {
  const { email, password } = loginData;

  if (!email || !password) {
    throw new Error("Por favor, forneça e-mail e senha.");
  }

  // Encontra o usuário, já incluindo o 'Role' para usar no token
  const user = await User.findOne({ 
    where: { email: email },
    include: { model: Role, attributes: ['name'] } 
  });

  if (!user) {
    // Lança um erro que o controller vai tratar como 401 (Não Autorizado)
    throw new Error("Credenciais inválidas.");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordCorrect) {
    throw new Error("Credenciais inválidas.");
  }

  // Lógica de negócio: gerar o token
  const payload = {
    id: user.id,
    role: user.Role.name
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  // O serviço retorna o token, a lógica está completa
  return token;
}

module.exports = {
  registerUser,
  loginUser, 
};