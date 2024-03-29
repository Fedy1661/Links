const { Router } = require('express');
const Link = require('../models/Link');
const router = Router();

router.get('/:code', async (req, res) => {
  try {
    const link = await Link.findOne({ code: req.params.code });

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    link.clicks++;
    await link.save();

    res.redirect(link.from);
  } catch (e) {
    res.status(500).send({ message: 'Что-то пошло не так..' });
  }
  // res.status(200);
});

module.exports = router;
