const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = Router();

// .post(url, middlewares, func)

// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({
      min: 6
    })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Проверка на наличие ошибок в валидации
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации.'
        });
      }
      // Получаем EMAIL и PASSWORD из POST
      const { email, password } = req.body;

      // Делаем запрос в базу данных и ищем возможного пользователя с данным Email'ом
      const candidate = await User.findOne({ email });

      if (candidate) {
        // => пользователь с такой почтой уже существует
        // Отправляем Bad Request(400) - "Плохой запрос". Этот ответ означает, что сервер не понимает запрос из-за неверного синтаксиса.
        return res
          .status(400)
          .json({ message: 'Данный пользователь уже существует.' });
      }
      // Пользователь не найден. Идём дальше.
      const hashedPassword = await bcrypt.hash(password, 12);
      // Передаём нового пользователя в базу данных
      const user = new User({ email, password: hashedPassword }); // 1. Создаем пользователя для помещения в базу данных.
      await user.save(); // 2. Отправляем на сохранение в базу данных.
      res.status(201).json({ message: 'Пользователь создан.' });
    } catch (e) {
      // Отправляем статус об ошибке и в .json помещаем объект для frontend'a
      // 	Internal Server Error(500) - "Внутренняя ошибка сервера". Сервер столкнулся с ситуацией, которую он не знает как обработать.
      console.log(e);
      res.status(500).json({
        message: 'Что-то пошло не так..',
        error: e.message
      });
    }
  }
);

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Введите корректный email')
      .normalizeEmail()
      .isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Проверка на наличие ошибок в валидации
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при авторизации.'
        });
      }

      const { email, password } = req.body;

      // Посылаем запрос на проверку наличия пользователя в базе данных
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }
      // Пользователь найден, идём дальше...
      // Проверяем сходство паролей
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Неверный логин или пароль' });
      }
      // ...пароли сошлись

      // создаем сессию. [данные, ключ шифрования, параметры]

      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
        expiresIn: '1h'
      });

      res.json({ token, userId: user.id });
    } catch (e) {
      // Отправляем статус об ошибке и в .json помещаем объект для frontend'a
      // 	Internal Server Error(500) - "Внутренняя ошибка сервера". Сервер столкнулся с ситуацией, которую он не знает как обработать.
      res.status(500).json({ message: 'Что-то пошло не так..' });
    }
  }
);

module.exports = router;
