// src/config/config.js
require('dotenv').config();
const path = require('path');

// O caminho para a sua wallet
const walletPath = path.join(__dirname, '../../oracle_wallet');

module.exports = {
  // Ambiente de desenvolvimento
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'dummy_db_name', // Necessário, mesmo que não seja usado diretamente
    dialect: 'oracle', // O dialeto como uma string
    dialectOptions: {
      connectString: process.env.DB_CONNECT_STRING,
      walletLocation: walletPath,
      walletPassword: process.env.DB_WALLET_PASSWORD,
    },
    logging: console.log, // Útil para ver o SQL durante o desenvolvimento
  },
  // Ambiente de produção (usado no seu servidor)
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'dummy_db_name',
    dialect: 'oracle',
    dialectOptions: {
      connectString: process.env.DB_CONNECT_STRING,
      walletLocation: walletPath,
      walletPassword: process.env.DB_WALLET_PASSWORD,
    },
    logging: false, // Desliga os logs de SQL em produção
  },
    test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'dummy_db_name',
    dialect: 'oracle',
    dialectOptions: {
      connectString: process.env.DB_CONNECT_STRING,
      walletLocation: walletPath,
      walletPassword: process.env.DB_WALLET_PASSWORD,
    },
    logging: false, // Definitivamente false para testes!
  },
};