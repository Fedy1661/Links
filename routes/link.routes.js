const { Router } = require('express');
const config = require('config');
const shortid = require('shortid');
const { check, validationResult } = require('express-validator');
const Link = require('../models/Link');
const auth = require('../middleware/auth.middleware');

const router = Router();

router.post(
  '/generate',
  auth,
  [check('from', 'Not URL').isURL()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Проверка на наличие ошибок в валидации
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные.'
        });
      }
      const { baseURL } = config;
      const { from } = req.body;

      const code = shortid.generate();
      const existing = await Link.findOne({ from });
      if (existing) {
        return res.json({ link: existing });
      }
      const to = baseURL + '/t/' + code;
      // req.user.userId - берётся из middleware auth
      const link = new Link({ code, to, from, owner: req.user.userId });
      await link.save();

      res.status(201).json({ link });
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так..' });
    }
  }
);

// Добавили middleware 'auth' для проверки пользователя.
router.get('/', auth, async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user.userId });
    res.json(links);
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так..' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id); // ?
    console.log(link);
    res.json(link);
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так..' });
  }
});

module.exports = router;
