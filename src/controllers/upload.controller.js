// src/controllers/upload.controller.js
const { put } = require('@vercel/blob');
const path = require('path');

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }
    
    // Gera um nome de arquivo único com a data/hora para evitar conflitos
    const fileName = `${Date.now()}_${file.originalname}`;
    
    // Envia o buffer do arquivo para o Vercel Blob
    const blob = await put(fileName, file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Retorna a URL pública da imagem
    return res.status(200).json({ location: blob.url });

  } catch (err) {
    console.error('Erro ao fazer upload para o Vercel Blob:', err);
    return res.status(500).json({ message: 'Erro interno ao fazer upload da imagem.' });
  }
};