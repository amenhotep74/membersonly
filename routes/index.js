var express = require("express");
var router = express.Router();
const validator = require("express-validator");
const Message = require("../models/Message");

const { ensureAuthenticated, fowardAuthenticated } = require("../config/auth");

// Show welcome page
router.get("/", fowardAuthenticated, (req, res, next) => res.render("welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res, next) => {
  // Return all messages from the database
  Message.find()
    .exec()
    .then((listMessages) => {
      const data = {
        message: listMessages,
        user: req.user,
      };
      res.render("dashboard", data);
    })
    .catch((err) => {
      return next(err);
    });
});

// Display message create form on GET.
router.get("/dashboard/create", (req, res, next) => {
  res.render("message_create", {
    user: req.user,
  });
});

// Message form POST - Submit output to database
router.post("/dashboard/create", (req, res, next) => {
  console.log("req.body.title: " + req.body.title);
  console.log("req.body.content: " + req.body.content);
  console.log("req.body.user: " + req.body.user);
  const newMessage = new Message({
    title: req.body.title,
    content: req.body.content,
    author: req.body.user,
  });
  newMessage
    .save()
    .then((message) => {
      console.log("Message saved to database");
      res.redirect("/dashboard");
    })
    .catch((err) => {
      res.status(400).send("Unable to save to the database");
      res.redirect("/dashboard/create");
    });
});

module.exports = router;
