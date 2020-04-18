const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
