const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');

/**
 * @route POST /api/user/create
 * @desc Создать нового пользователя
 * @access Public
 */
router.post('/create', async (req, res) => {
  const userData = req.body;
  const result = await createUser(userData);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error
    });
  }

  res.status(201).json({
    success: true,
    data: result.data
  });
});

module.exports = router; 