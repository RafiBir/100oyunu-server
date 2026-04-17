const fs   = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'scores.json');

function load() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch { return []; }
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data));
}

function insertScore(nickname, score, date) {
  const data = load();
  data.push({ nickname, score, date });
  save(data);
}

function getTopScores(limit = 20) {
  const data = load();
  return data
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r, i) => ({ rank: i + 1, nickname: r.nickname, score: r.score, date: r.date }));
}

function getRank(score) {
  const data  = load();
  const better = data.filter(r => r.score > score).length;
  return { rank: better + 1, total: data.length };
}

module.exports = { insertScore, getTopScores, getRank };
