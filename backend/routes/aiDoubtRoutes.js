const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');
const http = require('http');

const AI_SERVICE_URL = process.env.AI_DOUBT_URL || 'http://localhost:5001';

const proxyToAI = (path) => async (req, res) => {
  try {
    const url = new URL(path, AI_SERVICE_URL);
    if (req.method === 'GET' && req.query) {
      Object.entries(req.query).forEach(([k, v]) => url.searchParams.set(k, v));
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    };

    const proxyReq = http.request(options, (proxyRes) => {
      let data = '';
      proxyRes.on('data', (chunk) => data += chunk);
      proxyRes.on('end', () => {
        try {
          res.status(proxyRes.statusCode).json(JSON.parse(data));
        } catch {
          res.status(502).json({ error: 'Invalid response from AI service' });
        }
      });
    });

    proxyReq.on('error', () => {
      res.status(503).json({ error: 'AI Doubt service is not running. Start it with: cd backend/ai-doubt-system && python app.py' });
    });

    proxyReq.on('timeout', () => {
      proxyReq.destroy();
      res.status(504).json({ error: 'AI service timeout' });
    });

    if (req.body && req.method === 'POST') {
      proxyReq.write(JSON.stringify(req.body));
    }
    proxyReq.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

router.post('/chat', protect, proxyToAI('/api/chat'));
router.get('/subjects', protect, proxyToAI('/api/subjects'));
router.get('/health', proxyToAI('/api/health'));

module.exports = router;
