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
      ]).toArray().then((chat) => {
        console.log(chat);
        res.json(chat);
      }).catch((err) => {
        console.log(err);
        // APIがたたかれたときに422のエラーコードを返す。json型errorsを送る
        return res.status(422).send({
          errors: [{ title: "User error", detail: "Something went wrong!" }],
        });
      }).then(() => {
        client.close();
      });
  });
});

// router.get("/:messageId", function (req, res) {
//   const messageId = req.params.messageId;
//   Message.findById(messageId, function (err, foundMessage) {
//     if (err) {
//       return res.status(422).send({
//         errors: [{ tittle: "Message error", detail: "Message not found" }],
//       });
//     }
//     return res.json(foundMessage);
//   });
// });

// ebata.yuya＜「/regist」とできるのはindex.jsで「/api/comment」を指定している為！！(# ﾟДﾟ)
// router.post("/regist", function (req, res) {
//   const uid = req.body.uid;
//   const message = req.body.message;
//   const date = req.body.date;

//   // const fakeDb = new FakeDb();
//   // fakeDb.initDb();

//   if (!uid) {
//     return res.status(422).send({
//       errors: [{ title: "uid error", detail: "uid not found" }],
//     });
//   }
//   if (!message) {
//     return res.status(422).send({
//       errors: [{ title: "comment error", detail: "comment not found" }],
//     });
//   }
//   if (!date) {
//     return res.status(422).send({
//       errors: [{ title: "date error", detail: "date not found" }],
//     });
//   }

//   const addMessage = new Message({
//     uid: uid,
//     message: message,
//     date: date,
//   });

//   addMessage.save();
//   return res.json({ registerd: true });
// });

// ebata.yuya＜「/add」とできるのはindex.jsで「/api/comment」を指定している為！！(# ﾟДﾟ)
router.post("/add", function (req, res) {
  const uid = req.body.uid;
  const message = req.body.message;
  const date = req.body.date;

  const addMessage = new Message({
    uid: uid,
    message: message,
    date: date,
  });

  addMessage.save();
  return res.json({ registerd: true });
});

module.exports = router;
