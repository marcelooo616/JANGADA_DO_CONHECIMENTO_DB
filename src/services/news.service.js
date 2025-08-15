const axios = require('axios');

async function fetchMicrosoftNews() {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) throw new Error("Chave da News API não encontrada no .env do servidor.");

    const url = `https://newsapi.org/v2/everything?q=microsoft&language=pt&sortBy=publishedAt&apiKey=${apiKey}`;
    
    const response = await axios.get(url);
    return response.data.articles;

  } catch (error) {
    console.error("Erro ao buscar notícias da News API:", error.message);
    throw new Error("Não foi possível buscar as notícias externas.");
  }
}

module.exports = { fetchMicrosoftNews };