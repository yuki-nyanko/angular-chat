import { Component } from '@angular/core';
import { Comment } from './class/comment';
import { User } from './class/user';
import { MessageService } from './services/message.service';
import { Observable } from 'rxjs';

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

  addComment(comment: string): void {
    if (comment) {
      console.log("入力文字：" + comment);
      // 第3引数はMongoDBで自動生成される_idの為、無し
      const chat = new Comment(new User(this.currentUser.uid, ''), comment);
      this.messageService.addMessages(chat).subscribe(
        (err) => {
          console.error('次のエラーが発生しました: ' + err);
        },
        () => {
          console.log('送信完了');
        },
      );
    }
  }

  ngOnInit() {
    const messageObservable = this.messageService.getMessages();
    messageObservable.subscribe(
      (messages) => {
        console.log(messages);
        for (const message of messages) {
          console.log(message.user[0].name);
          // userの値は1つしかない為、userの0番目を取得する
          this.comments.push(new Comment(new User(message.user[0].uid, message.user[0].name), message.message, message._id));
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
}
