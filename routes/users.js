var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
const passport = require('passport');

// load user model
const User = require('../models/User');
// const { fowardAuthenticated } = require('../config/auth');

// Get register page
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Fields validation
  // Output messages to top of the form
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 3) {
    errors.push({ msg: 'Password must be at least 3 characters' });
  }

  // if there is any errors re-render the register form page pass the values into the form inputs as values
  console.log(errors);
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // See if there is any matches for email in database if there is then print 'Email already exists and re-render the view
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        // else create a new User to be inserted into the database
        const newUser = new User({
          name,
          email,
          password,
        });
      }
    });
  }
});

module.exports = router;
