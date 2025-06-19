const crypto = require('crypto');

// Маппинг групп пользователей
const USER_GROUPS = {
  ADMIN: 'ADMIN',
  DIRECTION: 'DIRECTION'
};

// Специальные символы для токена
const SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

/**
 * Генерирует случайную строку заданной длины
 * @param {number} length - Длина строки
 * @param {string} chars - Строка с символами для генерации
 * @returns {string} Сгенерированная строка
 */
const generateRandomString = (length, chars) => {
  const randomBytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
};

/**
 * Генерирует токен для указанной группы пользователей
 * @param {string} userGroup - Группа пользователей (ADMIN, DIRECTION)
 * @returns {string} Сгенерированный токен
 */
const generateToken = (userGroup) => {
  if (!USER_GROUPS[userGroup]) {
    throw new Error(`Неизвестная группа пользователей: ${userGroup}`);
  }

  // Генерируем случайную часть токена
  const randomPart = generateRandomString(12, 
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' + SPECIAL_CHARS
  );

  // Формируем токен в формате T_GROUP_randomPart
  return `T_${userGroup}_${randomPart}`;
};

/**
 * Проверяет валидность токена
 * @param {string} token - Токен для проверки
 * @returns {boolean} Результат проверки
 */
const validateToken = (token) => {
  const tokenRegex = /^T_(ADMIN|STUDENT|TEACHER|STAFF)_[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]{12}$/;
  return tokenRegex.test(token);
};

module.exports = {
  generateToken,
  validateToken,
  USER_GROUPS
}; 