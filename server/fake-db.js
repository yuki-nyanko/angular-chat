const Message = require("./model/message");
const User = require("./model/user");

class FakeDb {
  constructor() {
    this.messages = [
      {
        uid: 1,
        message: "テスト",
        date: "2021/07/21",
      },
      {
        uid: 2,
        message: "テスト2",
        date: "2021/07/21",
      },
      {
        uid: 1,
        message: "テスト3",
        date: "2021/07/21",
      },
    ];
    this.users = [
      {
        name: "江幡",
        initial: "e",
        uid: 1,
      },
      {
        name: "森井",
        initial: "m",
        uid: 2,
      },
    ];
  }

  async initDb() {
    await this.cleanDb();
    this.pushMessageToDb();
    this.pushUsersToDb();
  }

  async cleanDb() {
    await Message.deleteMany({});
    await User.deleteMany({});
  }

  pushMessageToDb() {
    // messages（複数の塊） ⇒ message（1つ取り出すから単数形に。わかりやすく名前を一致させてる）
    this.messages.forEach((message) => {
      const newMessage = new Message(message);
      newMessage.save();
    });
    // for (let i = 0; i < length(this.messages); i++) {
    //   message = this.messages(i)
    // }
  }
  pushUsersToDb() {
    this.users.forEach((user) => {
      const newUser = new User(user);
      newUser.save();
    });
  }

  seeDb() {
    this.pushMessageToDb();
    this.pushUsersToDb();
  }
}

module.exports = FakeDb;
