const User = require('../models/User');
const VerifyRequest = require('../models/verifyRequest');
const chalk = require('chalk');

/**
 * Создать нового пользователя и заявку на верификацию
 * @param {Object} userData - Данные пользователя
 * @returns {Promise<Object>} - Результат создания
 */
const createUser = async (userData) => {
  try {
    // Проверка обязательных полей
    const requiredFields = [
      'telegramID', 'fullName', 'inst', 'Ugroup', 'gradeBook'/*,
      'department', 'year', 'admissionYear', 'program', 'FoE', 'typeOfSet'*/
    ];
    const missing = requiredFields.filter(f => !userData[f]);
    if (missing.length > 0) {
      console.error(chalk.red('❌ Не заполнены обязательные поля:'), missing.join(', '));
      return {
        success: false,
        error: `Не заполнены обязательные поля: ${missing.join(', ')}`
      };
    }

    // Проверка на уникальность telegramID
    const exists = await User.findOne({ where: { telegramID: userData.telegramID } });
    if (exists) {
      console.error(chalk.red('❌ Пользователь с таким telegramID уже существует:'), userData.telegramID);
      return {
        success: false,
        error: 'Пользователь с таким telegramID уже существует'
      };
    }

    // Создание пользователя
    const user = await User.create(userData);
    console.log(chalk.green('✅ Пользователь успешно создан:'), user.telegramID);

    // Создание заявки на верификацию
    await VerifyRequest.create({
      telegramID: user.telegramID,
      status: 'pending',
      whoVerify: ''
    });
    console.log(chalk.blue('🔔 Заявка на верификацию создана для:'), user.telegramID);

    return {
      success: true,
      data: user
    };
  } catch (error) {
    console.error(chalk.red('❌ Ошибка при создании пользователя:'), error.message);
    return {
      success: false,
      error: 'Внутренняя ошибка сервера при создании пользователя'
    };
  }
};

module.exports = {
  createUser
}; 