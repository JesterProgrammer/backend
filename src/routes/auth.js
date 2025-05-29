const express = require('express');
const router = express.Router();

const VALID_TOKEN = "123";

// Проверка токена
router.post('/verify', (req, res) => {
  const { token } = req.body;

  if (token === VALID_TOKEN) {
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 часа
    });

    return res.json({ success: true });
  }

  return res.status(401).json({ error: 'Неверный токен' });
});

// Выход из системы
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true });
});

module.exports = router; 