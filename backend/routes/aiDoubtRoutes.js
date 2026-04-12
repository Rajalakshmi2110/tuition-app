const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/authMiddleware');
const Groq = require('groq-sdk');
const DoubtChat = require('../models/DoubtChat');
const { uploadGallery } = require('../config/cloudinary');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.get('/health', (req, res) => {
  res.json({ status: process.env.GROQ_API_KEY ? 'ok' : 'no_api_key' });
});

router.get('/history', protect, async (req, res) => {
  try {
    const chats = await DoubtChat.find({ studentId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(chats.reverse());
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.delete('/history', protect, async (req, res) => {
  try {
    await DoubtChat.deleteMany({ studentId: req.user._id });
    res.json({ message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

router.post('/chat', protect, uploadGallery.single('image'), async (req, res) => {
  try {
    const question = req.body.question;
    let history = [];
    try { history = JSON.parse(req.body.history || '[]'); } catch (e) {}

    if (!question) return res.status(400).json({ error: 'Question is required' });

    const imageUrl = req.file ? req.file.path : null;

    const user = req.user;
    const classLevel = user.className || '';
    const subjects = user.subjects?.join(', ') || '';

    const systemPrompt = `You are an expert academic tutor for school students at Kalviyagam Tuition Centre.
Student is in Class ${classLevel}${subjects ? `, studying: ${subjects}` : ''}.

Rules:
- Answer ONLY academic questions related to school subjects (Maths, Physics, Chemistry, Biology, English, Tamil, Social Science, etc.)
- Tailor your answer to Class ${classLevel} level — use age-appropriate language and examples
- Keep answers clear and concise: 3-8 sentences for simple questions, more for complex ones
- Use numbered steps for problem-solving, formulas where needed
- If the question is not academic (personal, inappropriate, off-topic), politely decline and ask them to ask a school-related question
- Do NOT use markdown formatting like ** or # or *. Use plain text only.
${imageUrl ? '- The student has attached an image for reference. Answer their question about it based on what they describe.' : ''}`;

    const messages = [{ role: 'system', content: systemPrompt }];

    const recent = history.slice(-6);
    for (const msg of recent) {
      if (msg.type === 'user') messages.push({ role: 'user', content: msg.text });
      else if (msg.type === 'bot' && msg.data?.answer) messages.push({ role: 'assistant', content: msg.data.answer });
    }

    const userMessage = imageUrl
      ? `[Student attached an image for reference]\n\n${question}`
      : question;
    messages.push({ role: 'user', content: userMessage });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 600,
      temperature: 0.7
    });

    const answer = (completion.choices[0]?.message?.content || 'Sorry, I could not generate an answer.')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^#{1,6}\s/gm, '');

    await DoubtChat.create({ studentId: user._id, question, answer, imageUrl });

    res.json({ status: 'success', question, answer, imageUrl, final_status: 'VALID' });
  } catch (err) {
    res.status(500).json({ status: 'error', answer: 'AI service error. Please try again.' });
  }
});

module.exports = router;
