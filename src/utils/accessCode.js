/**
 * Генерирует случайный код доступа из 6 цифр
 * @returns {string} Код доступа
 */
function generateAccessCode() {
  // Генерируем 6-значный код
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
}

module.exports = {
  generateAccessCode
}; 