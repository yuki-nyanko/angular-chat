const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config/");
const FakeDb = require("./fake-db");
const Comment = require("./model/message");
const app = express();
app.use(bodyParser.json());

const mongo = require("mongodb");

const httpServer = require("http").createServer(app);

const PORT = process.env.PORT || 3001;

app.get("/api/port", function (req, res) {
  console.log("success!!!");
  res.json({ port: PORT });
});

httpServer.listen(PORT, () =>
  console.log("Express server listening on port " + PORT)
);
// app.listen(PORT, () => console.log('Express server listening on port ' + PORT));

if (process.env.NODE_ENV === "production") {
  const appPath = path.join(__dirname, "..", "dist", "angular-async-means");
  app.use(express.static(appPath));
  app.get("*", function (req, res) {
    res.sendFile(path.resolve(appPath, "index.html"));
  });
}

//socket.ioのインスタンス作成
const io = require("socket.io")(httpServer, {
  cors: true,
  origins: ["*"],
});

//クライアントから接続があった時
io.on("connection", (socket) => {
  console.log("A user connected!");

  mongoose
    .connect(config.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      if (process.env.NODE_ENV !== "production") {
        const fakeDb = new FakeDb();
        // fakeDb.initDb();
      }
    });

  socket.on("joinChat", ({ chatId }) => {
    socket.join(chatId);
    socket.to(chatId).emit("joinChat", "Someone joined this chat!");
  });

  socket.on("selectMessages", (chatId) => {
    Comment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "uid",
          foreignField: "uid",
          as: "user",
        },
      },
      {
        $project: {
          date: "$date",
          message: "$message",
          uid: "$uid",
          name: "$user.name",
          initial: "$user.initial",
        },
      },
    ])
      .then((messages) => {
        console.log(messages);
        io.to(chatId.chatId).emit("recieveSelectMessages", messages);
      })
      .catch((err) => console.log(err));
  });

  socket.on("sendMessage", (message) => {
    // console.log('Someone sent a message!' + message);
    const newComment = new Comment(message.message);
    newComment.save();
    io.to(message.chatId).emit("receiveMessage", "You have got a message!");
    // console.log('Someone sent a message!' + message.message);
    // socket.emit('receiveMessage', 'You have got a message!' + message.message);
  });

  socket.on("deleteComment", (message) => {
    // console.log(message.comment._id);
    const id = new mongo.ObjectID(message.comment._id);
    // console.log(id);
    Comment.deleteOne({ _id: id })
      .then((result) => {
        // console.log(result);
      })
      .catch(function (err) {
        console.log("ERROR: ", err);
      });
    io.to(message.chatId).emit(
      "recieveDeleteComment",
      "A message was deleted!"
    );
  });

  socket.on("updateComment", (message) => {
    // console.log(message.comment._id);
    const id = new mongo.ObjectID(message.comment._id);
    // console.log(id);
    Comment.updateOne({ _id: id }, { message: message.comment.message })
      .then((result) => {
        // console.log(result);
      })
      .catch(function (err) {
        console.log("ERROR: ", err);
      });
    io.to(message.chatId).emit(
      "recieveUpdateComment",
      "A message was updated!"
    );
  });
});
