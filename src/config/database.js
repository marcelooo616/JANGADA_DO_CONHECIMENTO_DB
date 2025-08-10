// src/config/database.js

const Sequelize = require('sequelize');
const path = require('path'); // Módulo nativo do Node.js para lidar com caminhos de arquivos
require('dotenv').config();

// Criamos o caminho completo e correto para a pasta do wallet
// __dirname se refere ao diretório atual (src/config)
// '../../oracle_wallet' volta duas pastas e entra em 'oracle_wallet'
const walletPath = path.join(__dirname, '../../oracle_wallet');

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'dummy_db_name', // Isso ainda é necessário, mesmo não sendo usado diretamente
  
  // Opções específicas para o dialeto Oracle
  dialectOptions: {
    connectString: process.env.DB_CONNECT_STRING,
    
    // <<-- NOVAS OPÇÕES -->>
    // Aqui informamos ao driver onde encontrar a "carteira" e qual senha usar
    walletLocation: walletPath,
    walletPassword: process.env.DB_WALLET_PASSWORD,
  },
  
  // Mude para console.log para ver os comandos SQL que o Sequelize gera.
  // Por enquanto, vamos deixar 'false' para um log mais limpo.
  logging: false, 
});

module.exports = sequelize;