const FakeDb = require("../fake-db");
const express = require("express");
const router = express.Router();
const Message = require("../model/message");
const User = require("../model/user");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const config = require("../config/dev");
const ObjectId = require("mongodb").ob;
const bson = require("mongodb/node_modules/bson");

// メッセージ取得
// router.get("/get", (req, res) => {
// function getMessages() {
// MongoClient.connect(config.DB_URI, (err, client) => {
//   var db = client.db("myFirstDatabase");
//   db.collection("messages")
//     .aggregate([
//       {
//         $lookup: {
//           from: "users",
//           localField: "uid",
//           foreignField: "uid",
//           as: "user",
//         },
//       },
//     ])
//     .toArray()
//     .then((chat) => {
//       console.log(chat);
//       return chat;
//     })
//     .catch((err) => {
//       console.log(err);
//       // APIがたたかれたときに422のエラーコードを返す。json型errorsを送る
//       return res.status(422).send({
//         errors: [{ title: "User error", detail: "Something went wrong!" }],
//       });
//     })
//     .then(() => {
//       client.close();
//     });
// });
// }

// yuya＜「/add」とできるのはindex.jsで「/api/comment」を指定している為！！(# ﾟДﾟ)
// router.post("/add", function (req, res) {
function addMessages(chat) {
  const uid = chat._doc.uid;
  const message = chat._doc.message;
  const dayNum = new Date();
  const y = dayNum.getFullYear();
  const m = ("00" + (dayNum.getMonth() + 1)).slice(-2);
  const d = ("00" + dayNum.getDate()).slice(-2);
  const day = y + "/" + m + "/" + d;

  const addMessage = new Message({
    uid: uid,
    message: message,
    date: day,
  });

  addMessage.save();
  console.log("new message:", message);
  // return res.json({ registerd: true });
  return { added: true };
}

// router.post("/edit", function (req, res) {
function editMessages(chatId, chat) {
  const beforeMessageId = { _id: new bson.ObjectId(chatId) };
  const afterMessage = { $set: { message: chat } };

  MongoClient.connect(config.DB_URI, (err, client) => {
    var db = client.db("myFirstDatabase");
    db.collection("messages").updateOne(beforeMessageId, afterMessage);
    // return res.json({ edited: true });
    return { edited: true };
  });
}

// router.post("/delete", (req, res) => {
function deleteMessages(chatId) {
  const deleteMessageId = { _id: new bson.ObjectId(chatId) };

  MongoClient.connect(config.DB_URI, (err, client) => {
    var db = client.db("myFirstDatabase");
    db.collection("messages").deleteOne(deleteMessageId);
    return { deleted: true };
  });
};

// module.exports = { router, getMessages };
module.exports = { router, addMessages, editMessages, deleteMessages };
