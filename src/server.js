const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const sequelize = require('./config/database');

// Импорт маршрутов
const authRoutes = require('./routes/auth');
const verifyRoutes = require('./routes/verify');
const privilegeRoutes = require('./routes/privilege');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'https://kubstu.jesterstudio.ru'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.use(cookieParser());

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/privilege', privilegeRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Что-то пошло не так!' });
});

// Инициализация базы данных и запуск сервера
sequelize.authenticate()
  .then(() => {
    console.log('База данных успешно подключена.');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: https://api.jesterstudio.ru/health`);
      console.log(`Auth routes: https://api.jesterstudio.ru/api/auth`);
      console.log(`Verify routes: https://api.jesterstudio.ru/api/verify`);
      console.log(`Privilege routes: https://api.jesterstudio.ru/api/privilege`);
      console.log(`User routes: https://api.jesterstudio.ru/api/user`);
    });
  })
  .catch(err => {
    console.error('Ошибка при подключении к базе данных:', err);
  }); 