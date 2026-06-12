const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const GRID_FILE = path.join(__dirname, 'grid.json');

// Standard-Grid beim Start
const defaultGrid = {
  race: "Monaco GP 2026",
  updatedAt: new Date().toISOString(),
  drivers: Array.from({length: 22}, (_, i) => ({
    position: i + 1,
    name: `Driver ${i + 1}`,
    team: "Team",
    number: i + 1,
    assetKey: "placeholder"
  }))
};

// Grid laden
app.get('/api/grid', (req, res) => {
  try {
    const data = fs.readFileSync(GRID_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch {
    res.json(defaultGrid);
  }
});

// Grid speichern
app.post('/api/grid', (req, res) => {
  const grid = { ...req.body, updatedAt: new Date().toISOString() };
  fs.writeFileSync(GRID_FILE, JSON.stringify(grid, null, 2));
  res.json({ success: true, updatedAt: grid.updatedAt });
});

// Assets-Liste (welche Fahrer haben Videos/Bilder auf GitHub)
app.get('/api/assets', (req, res) => {
  // Du pflegst diese Liste manuell oder via GitHub API
  const GITHUB_RAW = 'https://raw.githubusercontent.com/DEIN_USER/f1-intro-overlay/main/assets/drivers';
  res.json({
    baseUrl: GITHUB_RAW,
    drivers: req.query.keys ? req.query.keys.split(',') : ['placeholder']
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`F1 API running on port ${PORT}`));