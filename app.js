const path = require('path');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const compression = require('compression');

const covidRouter = require('./routes/covidRoutes');

const app = express();

const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP! Please try again after an hour.',
});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Security Middlewares
app.use(helmet());
app.use('/', limiter);
app.use(xss());
app.use(compression());

// Route
app.use('/', covidRouter);

app.all('*', (req, res) => {
  res.status(404).render('notfound', {
    header: 'Not found',
    message:
      'The link you entered may be broken or the page may have been removed.',
  });
});

app.disable('x-powered-by');

module.exports = app;
