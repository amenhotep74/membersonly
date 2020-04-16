var express = require('express');
var router = express.Router();

// Show welcome page
router.get('/', (req, res) => res.render('welcome'));

// Dashboard

module.exports = router;
