const express = require('express');
const router = express.Router();
const { getUserPrivilegeAndToken } = require('../controllers/privilegeController');

/**
 * @route POST /api/privilege/generate-token
 * @desc Сгенерировать токен для пользователя
 * @access Public
 */
router.post('/generate-token', async (req, res) => {
  const { telegramID } = req.body;
  
  if (!telegramID) {
    return res.status(400).json({
      success: false,
      error: 'Не указан Telegram ID пользователя'
    });
  }

  const result = await getUserPrivilegeAndToken(telegramID);
  
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error
    });
  }

  res.json({
    success: true,
    data: result.data
  });
});

/**
 * @route GET /api/privilege/:telegramID
 * @desc Получить привилегии пользователя
 * @access Public
 */
router.get('/:telegramID', async (req, res) => {
  const { telegramID } = req.params;
  
  const result = await getUserPrivilegeAndToken(telegramID);
  
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error
    });
  }

  res.json({
    success: true,
    data: result.data
  });
});

module.exports = router; 