// src/controllers/auth.controller.js

const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    // 1. O Controller apenas extrai os dados da requisição
    const userData = req.body;

    // 2. Chama o Service para executar a lógica de negócio
    const newUser = await authService.registerUser(userData);

    // 3. Formata e envia a resposta de sucesso
    // Não enviamos o hash da senha de volta!
    res.status(201).json({
      id: newUser.id,
      full_name: newUser.full_name,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt
    });

  } catch (error) {
    // 4. Se o serviço lançar um erro, o controller o captura e envia a resposta de erro
    // Podemos verificar a mensagem de erro para retornar o status HTTP correto
    if (error.message.includes("e-mail já está em uso") || error.message.includes("nome de usuário já está em uso")) {
      return res.status(409).json({ message: error.message });
    }
    if (error.message.includes("preencha todos os campos")) {
      return res.status(400).json({ message: error.message });
    }
    
    console.error("Erro no controller de registro:", error);
    res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await authService.loginUser(req.body);

    res.status(200).json({
      message: "Login bem-sucedido!",
      token: token,
    });

  } catch (error) {
    // Verifica a mensagem de erro para retornar o status correto
    if (error.message.includes("Credenciais inválidas")) {
      return res.status(401).json({ message: error.message });
    }
    if (error.message.includes("forneça e-mail e senha")) {
        return res.status(400).json({ message: error.message });
    }

    console.error("Erro no controller de login:", error);
    res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
  }
};

// Quando criarmos o login, faremos o mesmo:
// exports.login = async (req, res) => { ... }