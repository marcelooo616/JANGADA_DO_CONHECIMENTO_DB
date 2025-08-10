// src/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  // 1. Pegar o token do header da requisição
  // O formato padrão é "Bearer TOKEN_LONGO_AQUI"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Pega só a parte do token

  if (token == null) {
    // 401 Unauthorized: se não houver token
    return res.status(401).json({ message: "Acesso negado. Nenhum token fornecido." });
  }

  // 2. Verificar se o token é válido
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // 403 Forbidden: se o token for inválido ou expirado
      return res.status(403).json({ message: "Acesso negado. O token é inválido." });
    }

    // 3. Se tudo estiver ok, salva os dados do usuário na requisição
    // e chama o próximo passo (o controller da rota)
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
}

module.exports = verifyToken;