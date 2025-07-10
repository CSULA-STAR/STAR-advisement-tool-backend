// GET /
const scrapeAssistData = require('./scrapeAssist.controller');

const autoimport = async (req, res) => {
  const { college, major } = req.query;

  if (!college || !major) {
    return res.status(400).json({ error: 'Missing "college" or "major" parameter' });
  }

  try {
    const data = await scrapeAssistData(college, major);
    res.json(data);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to fetch course data' });
  }
};

module.exports = {
  autoimport
};
