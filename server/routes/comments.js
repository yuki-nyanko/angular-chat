const express = require("express");
const router = express.Router();
const Message = require("../model/message");
const User = require("../model/user");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const config = require("../config/dev");

router.get("", function (req, res) {
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
        return res.status(422).send({
          errors: [{ title: "User error", detail: "Something went wrong!" }],
        });
      })
      .then(() => {
        client.close();
      });
  });

  Message.find({}, function (err, foundMessages) {
    return res.json(foundMessages);
  });
});

router.get("/:messageId", function (req, res) {
  const messageId = req.params.messageId;
  Message.findById(messageId, function (err, foundMessage) {
    if (err) {
      return res.status(422).send({
        errors: [{ tittle: "Message error", detail: "Message not found" }],
      });
    }
    res.json(foundMessage);
  });
});

module.exports = router;
