const crypto = require("crypto");
const express = require("express");
const path = require("path");
const config = require("./config/");
const mongo = require("mongodb");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const FakeDb = require("./fake-db");
const commentRoutes = require("./routes/comments");
const Message = require("./model/message");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  // 接続許可 httpServer:3001 <=> *:4200とか
  cors: true,
  origins: ["*"],
});

io.on("connection", (socket) => {
  console.log("ユーザーが接続しました");
  // ログイン
  mongoose
    .connect(config.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      // if (process.env.NODE_ENV !== "production") {
      // }
      const fakeDb = new FakeDb();
      fakeDb.initDb();
    });

  // // トークンを作成
  // const token = makeToken(socket.id);
  // // 本人にトークンを送付
  // socket.to(socket.id).emit("token", { token: token });

  socket.on("selectMessages", (chatId) => {
    // // const message = commentRoutes.getMessages();
    // // socket.emit("reciveMessages", { message: message });
    // new Promise((resolve, reject) => {
    //   const chat = commentRoutes.getMessages();
    //   resolve(chat);
    //   reject();
    // })
    //   .then((chat) => {
    //     console.log("受け渡し前");
    //     socket.emit("reciveMessages", chat);
    //     console.log("受け渡し後");
    //   })
    //   .catch((chat) => {
    //     // 非同期処理が失敗した場合
    //     console.log("実行結果:" + chat); // 呼ばれない
    //   });
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
          socket.emit("reciveSelectMessages", chat);
        })
        .catch((err) => {
          console.log(err);
        })
        .then(() => {
          // client.close();
        });
    });
  });

  socket.on("addMessages", (chat) => {
    const commentSchema = new Message(chat.chat);
    let saveComment = commentRoutes.addMessages(commentSchema);
    socket.emit("reciveMessages", saveComment);
    // commentRoutes.addMessages();
    // socket.emit("reciveMessages", { message: "flg" });
  });

  socket.on("editMessages", (editChat) => {
    // const commentSchema = new Message(editChat.chat);
    let saveComment = commentRoutes.editMessages(
      editChat.chat.message._id,
      editChat.chat.message.message
    );
    socket.emit("reciveMessages", saveComment);
  });

  socket.on("deleteMessages", (deleteChat) => {
    let saveComment = commentRoutes.deleteMessages(deleteChat.message._id);
    socket.emit("reciveMessages", saveComment);
  });
});
const PORT = process.env.PORT || 3001;

app.use(express.json());

// app.use("/api/v1/chats", commentRoutes);

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

// トークンを作成
function makeToken(id) {
  const str = "test" + id;
  return crypto.createHash("sha1").update(str).digest("hex");
}
