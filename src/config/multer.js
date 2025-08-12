// src/config/multer.js
const multer = require('multer');

// Usaremos armazenamento em memória para pegar o buffer do arquivo
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;