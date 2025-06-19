const { Sequelize } = require('sequelize');
const chalk = require('chalk');
require('dotenv').config();

// Проверяем наличие необходимых переменных окружения
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error(chalk.red('❌ Отсутствуют необходимые переменные окружения:'), missingEnvVars.join(', '));
    console.log(chalk.yellow('ℹ️ Используем значения по умолчанию для локальной разработки'));
}

// Настройки для локальной разработки
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '3306');
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'DigitalUniversity';

// Выводим информацию о подключении (без пароля)
console.log(chalk.blue('🔍 Параметры подключения к БД:'), {
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser
});

// Конфигурация подключения к базе данных
const sequelize = new Sequelize({
    dialect: 'mariadb',
    host: dbHost,
    port: dbPort,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 10000
    },
    dialectOptions: {
        connectTimeout: 5000,
        acquireTimeout: 5000,
        timeout: 5000,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    },
    retry: {
        max: 5,
        match: [/Deadlock/i, /Connection timeout/i, /SequelizeConnectionError/i]
    }
});

// Функция для проверки подключения с повторными попытками
const testConnection = async (retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(chalk.blue(`🔄 Попытка подключения ${i + 1}/${retries}...`));
            await sequelize.authenticate();
            console.log(chalk.green('✅ Подключение к базе данных установлено успешно'));
            return true;
        } catch (err) {
            console.error(chalk.yellow(`⚠️ Попытка подключения ${i + 1}/${retries} не удалась:`));
            console.error(chalk.red('Ошибка:'), err.message);
            if (i < retries - 1) {
                console.log(chalk.blue(`🕐 Ожидание ${delay / 1000} секунд перед следующей попыткой...`));
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    return false;
};

// Запускаем проверку подключения
testConnection().then(success => {
    if (!success) {
        console.log(chalk.yellow('⚠️ Приложение запущено без подключения к базе данных!'));
    }
});

module.exports = sequelize; 