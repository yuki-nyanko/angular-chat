const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  initial: String,
  uid: Number,
});

module.exports = mongoose.model("User", userSchema);
