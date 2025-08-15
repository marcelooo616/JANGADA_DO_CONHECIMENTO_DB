
const newsService = require('../services/news.service');


exports.getMicrosoftNews = async (req, res) => {
  try {
    const articles = await newsService.fetchMicrosoftNews();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};