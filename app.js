var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const hbs = require('hbs');

var app = express();

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware here

// Connect flash
app.use(flash());

// Global variables (for errors msgs)
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
