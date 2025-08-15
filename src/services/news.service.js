// src/services/news.service.js
const axios = require('axios');

const NEWS_API_KEY = process.env.NEWS_API_KEY;

async function findMicrosoftNews(queryOptions) { // Agora aceita queryOptions
  if (!NEWS_API_KEY) {
    throw new Error('Chave da News API não encontrada no .env do servidor.');
  }

  // Pega a página e o limite da query, com valores padrão
  const page = parseInt(queryOptions.page, 10) || 1;
  const pageSize = parseInt(queryOptions.pageSize, 10) || 6; // Mantemos o padrão de 6

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'microsoft',
        language: 'pt',
        sortBy: 'publishedAt',
        apiKey: NEWS_API_KEY,
        pageSize: pageSize, // <<-- Parâmetro para o tamanho da página
        page: page,         // <<-- Parâmetro para o número da página
      }
    });

    // Retornamos os dados junto com a informação de paginação
    return {
      news: response.data.articles,
      totalResults: response.data.totalResults,
      totalPages: Math.ceil(response.data.totalResults / pageSize),
      currentPage: page,
    };

  } catch (error) {
    console.error("Erro ao buscar notícias da News API:", error.response?.data?.message || error.message);
    throw new Error('Não foi possível buscar as notícias externas.');
  }
}

module.exports = { findMicrosoftNews };