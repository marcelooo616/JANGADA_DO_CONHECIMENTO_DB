
const newsService = require('../services/news.service');


exports.getMicrosoftNews = async (req, res) => {
  try {
    // req.query contém os parâmetros da URL (ex: ?page=2&pageSize=5)
    // Nós passamos todo o objeto para o nosso serviço
    const newsData = await newsService.findMicrosoftNews(req.query);

    res.status(200).json(newsData);

  } catch (error) {
    // Se o serviço lançar um erro (ex: chave de API faltando), nós o capturamos aqui
    res.status(500).json({ message: error.message || "Erro interno ao buscar notícias." });
  }
};