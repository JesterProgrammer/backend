const express = require('express');
const router = express.Router();

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
router.get('/requests', (req, res) => {
  res.json(mockStudents);
});

// Обновление статуса заявок
router.post('/update', (req, res) => {
  const { requestIds, isVerified } = req.body;
  
  // Здесь должна быть логика обновления статуса в базе данных
  console.log('Обновление статуса:', { requestIds, isVerified });
  
  res.json({ success: true });
});

module.exports = router; 