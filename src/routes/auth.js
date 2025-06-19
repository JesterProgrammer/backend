const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Добавьте импорт вашей модели User
const Token = require('../models/Token'); // Импортируем модель Token

// Проверка токена
router.post('/verify', async (req, res) => {
  const { token } = req.body;
  console.log('Verify request:', { token, cookies: req.cookies });

  // Ищем токен в базе
  const dbToken = await Token.findOne({ where: { token: token, status: 'active' } });
  if (dbToken) {
    console.log('Token found:', dbToken.token);
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
      path: '/',
      domain: '.jesterstudio.ru'
    });
    console.log('Cookie set, headers:', res.getHeaders());
    return res.status(200).json({ success: true });
  }

  console.log('Token not found or inactive');
  return res.status(401).json({ error: 'Неверный или неактивный токен' });
});

// Выход из системы
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    domain: '.jesterstudio.ru'
  });
  res.json({ success: true });
});

// Получить данные текущего пользователя по токену из куки
router.get('/me', async (req, res) => {
  const token = req.cookies['auth_token'];
  if (!token) {
    return res.status(401).json({ error: 'Нет токена' });
  }

  // В вашем случае токен — это просто строка, совпадающая с telegramID
  // Найдите пользователя по telegramID = token
  const tokenData = await Token.findOne({ where: { token: token } });
  const user = await User.findOne({ where: { telegramID: tokenData.whoRequest } });
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  res.json({ fullName: user.fullName });
});

module.exports = router; 