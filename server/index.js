const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const config = require("./config/");
const FakeDb = require("./fake-db");
const Comment = require("./model/message");
const commentRoutes = require("./routes/comments");
const app = express();
// app.use(bodyParser.json());
app.use(express.json());

const mongo = require("mongodb");

const httpServer = require("http").createServer(app);

const PORT = process.env.PORT || 3001;

app.use("/api/v1/chats", commentRoutes);

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

mongoose
  .connect(
    config.DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  )
  .then(() => {
    // if (process.env.NODE_ENV !== "production") {
    // }
    const fakeDb = new FakeDb();
    fakeDb.initDb();
  });

