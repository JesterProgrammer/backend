const Privilege = require('../models/Privilege');
const Token = require('../models/Token');
const { generateToken, validateToken, USER_GROUPS } = require('../utils/tokenGenerator');

/**
 * Получение привилегий и генерация токена для пользователя
 * @param {string} telegramID - Telegram ID пользователя
 * @returns {Promise<Object>} - Объект с токеном или ошибкой
 */
const getUserPrivilegeAndToken = async (telegramID) => {
  try {
    if (!telegramID) {
      return {
        success: false,
        error: 'Не указан Telegram ID пользователя'
      };
    }

    // Ищем пользователя в системе привилегий
    const privilege = await Privilege.findOne({
      where: { telegramID }
    });

    if (!privilege) {
      return {
        success: false,
        error: 'Пользователь не найден в системе привилегий'
      };
    }

    // Проверяем, что группа пользователя валидна
    if (!Object.values(USER_GROUPS).includes(privilege.permGroup)) {
      return {
        success: false,
        error: 'Неверная группа пользователя'
      };
    }

    // Генерируем токен
    const token = generateToken(privilege.permGroup);

    // Сохраняем токен в базу данных
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24); // Токен действителен 24 часа

    await Token.create({
      token,
      whoRequest: telegramID,
      status: 'active',
      dataExpiration: expirationDate
    });

    return {
      success: true,
      data: {
        telegramID: privilege.telegramID,
        permGroup: privilege.permGroup,
        token,
        expiresAt: expirationDate
      }
    };

  } catch (error) {
    console.error('Ошибка при получении привилегий и генерации токена:', error);
    return {
      success: false,
      error: 'Внутренняя ошибка сервера'
    };
  }
};

module.exports = {
  getUserPrivilegeAndToken
}; 