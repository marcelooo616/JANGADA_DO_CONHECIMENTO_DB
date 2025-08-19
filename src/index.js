// src/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importa o objeto 'db' já configurado pelo 'models/index.js'
const db = require('./models');

// Importa todas as suas rotas
const authRoutes = require('./routes/auth.routes');
const articleRoutes = require('./routes/article.routes');
const categoryRoutes = require('./routes/category.routes');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const newsRoutes = require('./routes/news.routes');
const courseRoutes = require('./routes/course.routes');
// ... e qualquer outra rota

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Usa as rotas
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/courses', courseRoutes);
// ...

const PORT = process.env.PORT || 3000;

// src/index.js

// ... (todo o seu código de configuração do app)

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log('[SUCCESS] Conexão com o banco de dados estabelecida.');
    
    await db.sequelize.sync({ force: false });
    console.log('[SUCCESS] Modelos sincronizados com o banco de dados.');
    
    await db.Role.findOrCreate({ where: { name: 'author' } });
    await db.Role.findOrCreate({ where: { name: 'admin' } });
    await db.Category.findOrCreate({ where: { name: 'Geral', slug: 'geral' } });

    // --- MUDANÇA IMPORTANTE AQUI ---
    // Apenas inicie o servidor se este arquivo for executado diretamente
    if (require.main === module) {
      app.listen(PORT, '0.0.0.0',() => {
        console.log(`[SUCCESS] Servidor iniciado e rodando na porta ${PORT}`);
      });
    }
    
  } catch (err) {
    console.error('[FATAL ERROR] Não foi possível iniciar o servidor:', err);
  }
}

// Apenas execute se não estiver no ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app; 

