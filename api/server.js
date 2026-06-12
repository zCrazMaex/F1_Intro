const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const JSONBIN_ID = process.env.JSONBIN_ID;
const JSONBIN_KEY = process.env.JSONBIN_KEY;

const HEADERS = {
  'Content-Type': 'application/json',
  'X-Master-Key': JSONBIN_KEY,
  'X-Bin-Meta': 'false'
};

// Grid laden
app.get('/api/grid', async (req, res) => {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
      headers: HEADERS
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Grid speichern
app.post('/api/grid', async (req, res) => {
  try {
    const grid = { ...req.body, updatedAt: new Date().toISOString() };
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(grid)
    });
    const data = await response.json();
    res.json({ success: true, updatedAt: grid.updatedAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Replay triggern
app.post('/api/replay', async (req, res) => {
  try {
    const r = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, { headers: HEADERS });
    const data = await r.json();
    const updated = { ...data, replayAt: new Date().toISOString() };
    await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(updated)
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`F1 API running on port ${PORT}`));
