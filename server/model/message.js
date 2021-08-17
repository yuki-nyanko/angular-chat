const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  uid: Number,
  message: String,
  date: String,
});

module.exports = mongoose.model("Message", MessageSchema);
