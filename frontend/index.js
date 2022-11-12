const express = require('express');
const { create } = require('express-handlebars');

const app = express();
const port = 4000;

const hbs = create({
  partialsDir: ['views/partials'],
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('assets'));

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Home',
  });
});

app.get('/list', (req, res) => {
  res.render('list', {
    title: 'List of buses',
  });
});

app.get('/fill-form', (req, res) => {
  res.render('fill-form', {
    title: 'Fill form',
  });
});

app.get('/booking', (req, res) => {
  res.render('booking', {
    title: 'Booking',
  });
});

app.get('/history', (req, res) => {
  res.render('history', {
    title: 'History',
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
