// GET /
const autoimport = async (req, res) => {
  try {
    res.json("Hello World!");
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

module.exports = {
  autoimport
};
