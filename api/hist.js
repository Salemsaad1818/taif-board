const { readHist } = require('./_store');
module.exports = async (req, res) => {
  try {
    const days = await readHist();
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ days });
  } catch (e) { res.setHeader('Cache-Control', 'no-store'); return res.status(500).json({ error: 'server' }); }
};
