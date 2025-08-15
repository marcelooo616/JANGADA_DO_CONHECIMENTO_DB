// src/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Import our central database object which includes sequelize and all models
const db = require('./models');
const authRoutes = require('./routes/auth.routes');
const articleRoutes = require('./routes/article.routes');
const categoryRoutes = require('./routes/category.routes');
const commentRoutes = require('./routes/comment.routes');
const uploadRoutes = require('./routes/upload.routes');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API da Plataforma de Artigos está no ar!' });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log('[SUCCESS] Conexão com o banco de dados estabelecida.');
    
    await db.sequelize.sync({ force: false });
    console.log('[SUCCESS] Modelos sincronizados com o banco de dados.');
    
    // Create default roles and categories
    await db.Role.findOrCreate({ where: { name: 'author' } });
    await db.Role.findOrCreate({ where: { name: 'admin' } });
    await db.Category.findOrCreate({ where: { name: 'Geral', slug: 'geral' } });

    if (require.main === module) {
      app.listen(PORT, '0.0.0.0',() => {
        console.log(`[SUCCESS] Servidor iniciado e rodando na porta ${PORT}`);
      });
    }
  } catch (err) {
    console.error('[FATAL ERROR] Não foi possível iniciar o servidor:', err);
  }
}

startServer();

module.exports = app;