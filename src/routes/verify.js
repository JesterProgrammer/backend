const express = require('express');
const router = express.Router();
const { generateAccessCode } = require('../utils/accessCode');
const sequelize = require('../config/database');
const Sequelize = require('sequelize');
const VerifyRequest = require('../models/verifyRequest')(sequelize, Sequelize);

// Временные данные для демонстрации
const mockStudents = {
  1: {
    request_id: 1,
    id: 1,
    z_n: "123456",
    tg_handle: "@student1",
    fio: "Иванов Иван Иванович",
    inst: "ИУЦТ",
    napr: "Информационные системы",
    kurs: "3",
    gruppa: "ИС-311",
    f_o: "Очная",
    vid_n: "Бакалавриат",
    god_post: "2021",
    kaf: "Информационные технологии"
  },
  2: {
    request_id: 2,
    id: 2,
    z_n: "654321",
    tg_handle: "@student2",
    fio: "Петров Петр Петрович",
    inst: "ИУЦТ",
    napr: "Программная инженерия",
    kurs: "2",
    gruppa: "ПИ-211",
    f_o: "Очная",
    vid_n: "Бакалавриат",
    god_post: "2022",
    kaf: "Информационные технологии"
  }
};

// Получение списка заявок
router.get('/requests', async (req, res) => {
  try {
    const requests = await VerifyRequest.findAll();
    res.json(requests);
  } catch (error) {
    console.error('Ошибка при получении списка заявок:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Обновление статуса заявок
router.post('/update', async (req, res) => {
  try {
    const { requestIds, isVerified } = req.body;
    
    await VerifyRequest.update(
      { 
        status: isVerified ? 'verified' : 'rejected',
        whoVerify: req.body.whoVerify // ID администратора, который выполнил верификацию
      },
      { 
        where: { id: requestIds }
      }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении статуса:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Генерация кода доступа по номеру зачетной книжки
router.post('/generate-access', async (req, res) => {
  try {
    const { gradeBook } = req.body;
    console.log('Получен запрос на генерацию кода:', { gradeBook });

    if (!gradeBook) {
      console.log('Ошибка: номер зачетной книжки не указан');
      return res.status(400).json({ error: 'Номер зачетной книжки обязателен' });
    }

    // Проверяем, существует ли уже заявка с таким номером зачетки
    const existingRequest = await VerifyRequest.findOne({
      where: { gradeBook: gradeBook }
    });

    if (existingRequest) {
      console.log('Найдена существующая заявка:', existingRequest);
      return res.status(400).json({ 
        error: 'Заявка с таким номером зачетной книжки уже существует',
        status: existingRequest.status
      });
    }

    // Генерируем уникальный код доступа
    const accessCode = generateAccessCode();
    console.log('Сгенерирован код доступа:', accessCode);

    // Создаем новую заявку на верификацию
    const verifyRequest = await VerifyRequest.create({
      gradeBook: gradeBook,
      status: 'pending',
      Code: accessCode,
      telegramID: '', // Будет заполнено позже при активации через бота
      whoVerify: '' // Будет заполнено при верификации администратором
    });

    console.log('Создана новая заявка:', verifyRequest);

    res.json({
      code: accessCode,
      status: 'pending'
    });

  } catch (error) {
    console.error('Ошибка при генерации кода доступа:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

router.post('/activate', async (req, res) => {
  try {
    const { code, telegramID } = req.body;

    if (!code || !telegramID) {
      return res.status(400).json({ error: 'Код и telegramID обязательны' });
    }

    // Ищем заявку с этим кодом и статусом pending
    const request = await VerifyRequest.findOne({
      where: { Code: code, status: 'pending' }
    });

    if (!request) {
      return res.status(400).json({ error: 'Код не найден или уже использован' });
    }

    // Обновляем заявку: статус -> verified, сохраняем telegramID, код становится неактивным
    await request.update({
      status: 'verified',
      telegramID: telegramID
    });

    return res.json({ success: true, message: 'Верификация прошла успешно' });
  } catch (error) {
    console.error('Ошибка при активации кода:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router; 