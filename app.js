const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const app = express();

app.use(express.json({ extended: true }));
// [ссылка, роут]
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/link', require('./routes/link.routes'));
app.use('/t', require('./routes/redirect.routes'));

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', async (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const { PORT, mongoURI } = config;

(async function() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
      // useCreateIndex: true
    });
    app.listen(PORT, () => console.log(`Приложение запущено на порту ${PORT}`));
  } catch (e) {
    console.log(`Server error ${e.message}`);
    process.exit(1);
  }
})();
