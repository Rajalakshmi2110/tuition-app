const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');

const AI_URL = process.env.AI_DOUBT_URL || 'http://127.0.0.1:5001';

const proxy = (path) => async (req, res) => {
  const url = `${AI_URL}${path}${req.method === 'GET' && req._parsedUrl.search ? req._parsedUrl.search : ''}`;
  try {
    const opts = { method: req.method, headers: { 'Content-Type': 'application/json' } };
    if (req.method === 'POST') opts.body = JSON.stringify(req.body);
    const response = await fetch(url, opts);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch {
    res.status(503).json({ error: 'AI service is not running. Start with: cd backend/ai-doubt-system && python app.py' });
  }
};

router.post('/chat', protect, proxy('/api/chat'));
router.get('/subjects', protect, proxy('/api/subjects'));
router.get('/health', proxy('/api/health'));

module.exports = router;
