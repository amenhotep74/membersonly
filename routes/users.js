var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
const passport = require("passport");

// load user model
const User = require("../models/User");
const { fowardAuthenticated } = require("../config/auth");

// Get register page
router.get("/register", fowardAuthenticated, (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Fields validation
  // Output messages to top of the form
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 3) {
    errors.push({ msg: "Password must be at least 3 characters" });
  }

  // if there is any errors re-render the register form page pass the values into the form inputs as values
  console.log(errors);
  if (errors.length > 0) {
    res.render("register", {
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
        errors.push({ msg: "Email already exists" });
        res.render("register", {
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

        // Encrpyt the password
        bcrypt.genSalt(10, (err, salt) => {
          // Encrypt the password from the User object we created before
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            // Insert into the database
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// Get login page
router.get("/login", fowardAuthenticated, (req, res, next) => {
  res.render("login");
});

// Login post
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  // Redirect back to login screen
  res.redirect("/users/login");
});

module.exports = router;
