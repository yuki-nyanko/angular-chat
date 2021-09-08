const FakeDb = require("../fake-db");
const express = require("express");
const router = express.Router();
const Message = require("../model/message");
const User = require("../model/user");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const config = require("../config/dev");

router.get("/get", function (req, res) {
  MongoClient.connect(config.DB_URI, (err, client) => {
    var db = client.db("myFirstDatabase");
    db.collection("messages")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "uid",
            foreignField: "uid",
            as: "user",
          },
        },
      ])
      .toArray()
      .then((chat) => {
        console.log(chat);
        res.json(chat);
      })
      .catch((err) => {
        console.log(err);
        // APIがたたかれたときに422のエラーコードを返す。json型errorsを送る
        return res.status(422).send({
          errors: [{ title: "User error", detail: "Something went wrong!" }],
        });
      })
      .then(() => {
        client.close();
      });
  });
});

// yuya＜「/add」とできるのはindex.jsで「/api/comment」を指定している為！！(# ﾟДﾟ)
router.post("/add", function (req, res) {
  const uid = req.body.user.uid;
  const message = req.body.message;
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
  return res.json({ registerd: true });
});

module.exports = router;
