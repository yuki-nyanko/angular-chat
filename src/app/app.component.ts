import { Component } from '@angular/core';
import { Comment } from './class/comment';
import { Chat } from './class/chat';
import { User } from './class/user';
import { MessageService } from './services/message.service';
// import { Observable } from 'rxjs';

const CURRENT_USER: User = new User(1, '江幡');
const ANOTHER_USER: User = new User(2, '森井');

@Component({
  selector: 'ac-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  message: any;

  // comments = COMMENTS;
  comments: Comment[] = new Array();
  currentUser = CURRENT_USER;
  comment = '';
  uid = '';

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messageService.connect(1);
    this.getCommnet();
  }

  getCommnet() {
    const messageObservable = this.messageService.reciveSelectMessages();
    messageObservable.subscribe(
      (messages: Comment[]) => {
        for (const message of messages) {
          console.log(message.user[0].name);
          // userの値は1つしかない為、userの0番目を取得する
          // this.comments.push(new Comment(new User(message.user[0].uid, message.user[0].name), message.message, message._id));
          this.comments.push(new Comment(message.uid, message.user[0].name, message.message, message._id));
        }
        console.log(this.comments);
      },
      (err) => {
        console.error('次のエラーが発生しました: ' + err);
      },
      () => {
        console.log('取得完了');
      },
    );
  }

  addComment(comment: string): void {
    if (comment) {
      console.log("入力文字：" + comment);
      // 第3引数はMongoDBで自動生成される_idの為、無し
      const chat = new Comment(this.currentUser.uid, "", comment);
      this.messageService.addMessages(1, chat);
      this.messageService.reciveSendMessages().subscribe(
        (err) => {
          console.log('送信中に次のエラーが発生しました。' + err)
        }
      );
      console.log("Success");
      this.comment = "";
      this.comments = [];
      this.messageService.selectMessages(1);
      // this.getCommnet();
    }
  }

  editComment(comment: string): void {
    if (comment) {
      console.log("編集中");
      // 第3引数はMongoDBで自動生成される_idの為、無し
      const chat = new Comment(this.currentUser.uid, "", comment);
      console.log(chat.message);
      this.messageService.editMessages(1, chat).subscribe((err) => {
        console.log('編集中に次のエラーが発生しました。' + err)
      });
    }
    console.log("編集完了");
    this.comment = "";
    this.comments = [];
    this.messageService.selectMessages(1);
    // this.getCommnet();
  }

  deleteComment(comment: string): void {
    console.log("削除中");
    // 第3引数はMongoDBで自動生成される_idの為、無し
    const chat = new Comment(this.currentUser.uid, "", comment);
    this.messageService.deleteMessages(chat);
    this.messageService.reciveDeleteMessages().subscribe(
      (err) => {
        console.log('削除中に次のエラーが発生しました。' + err)
      },
    );
    console.log('削除完了');
    this.comment = "";
    this.comments = [];
    this.messageService.selectMessages(1);
    // this.getCommnet();
  }
}
