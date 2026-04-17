const express = require('express');
const cors    = require('cors');
const { insertScore, getTopScores, getRank } = require('./db');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// GET /api/scores?limit=20
app.get('/api/scores', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  res.json(getTopScores(limit));
});

// POST /api/scores  { nickname, score }
app.post('/api/scores', (req, res) => {
  let { nickname, score } = req.body;

  if (typeof nickname !== 'string' || nickname.trim().length === 0) {
    return res.status(400).json({ error: 'Geçerli bir nickname gir.' });
  }
  nickname = escapeHtml(nickname.trim()).slice(0, 20);

  score = parseInt(score);
  if (isNaN(score) || score < 1 || score > 100) {
    return res.status(400).json({ error: 'Skor 1-100 arasında olmalı.' });
  }

  const date = new Date().toLocaleDateString('tr-TR', {
    day: '2-digit', month: '2-digit', year: '2-digit'
  });

  insertScore(nickname, score, date);
  const { rank, total } = getRank(score);
  res.json({ rank, total });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
