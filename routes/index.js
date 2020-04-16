var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Show welcome page
router.get('/', (req, res, next) => res.render('welcome'));

// Dashboard
router.get('/dashboard', (req, res, next) => {
  res.render('dashboard', {});
});
module.exports = router;
