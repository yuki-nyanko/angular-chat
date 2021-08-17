import { Component } from '@angular/core';
import { Comment } from './class/comment';
import { User } from './class/user';
import { MessageService } from './service/message.service';
import { Observable } from 'rxjs';

const CURRENT_USER: User = new User(1, '五十川 洋平');
const ANOTHER_USER: User = new User(2, '竹井 賢治');

const COMMENTS: Comment[] = [
  new Comment(ANOTHER_USER, 'お疲れさまです！'),
  new Comment(ANOTHER_USER, 'この間の件ですが、どうなりましたか？'),
  new Comment(CURRENT_USER, 'お疲れさまです！'),
  new Comment(CURRENT_USER, 'クライアントからOKが出ました！')
];

@Component({
  selector: 'ac-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  message: any;

  comments = COMMENTS;
  currentUser = CURRENT_USER;
  comment = '';

  addComment(comment: string): void {
    if (comment) {
      this.comments.push(new Comment(this.currentUser, comment));
    }
  }
  constructor(private messageService: MessageService) { }

  ngOnInit() {
    // this.comment = this.getMessages()

    const messageObservable = this.messageService.getMessages()
    messageObservable.subscribe(
      (data) => { this.message = data},
      (err) => { console.error('次のエラーが発生しました: ' + err) },
      () => { console.log('完了') },
    )

    // const observable = new Observable(subscriber => {
    //   subscriber.next(1);
    //   subscriber.next(2);
    //   subscriber.error("エラー発生");
    //   setTimeout(() => {
    //     subscriber.next(4);
    //     subscriber.complete();
    //   }, 1000);
    // });

    // console.log('subscribe前');
    // observable.subscribe({
    //   next(data) { console.log('次のデータが出力されました ' + data); },
    //   error(err) { console.error('次のエラーが発生しました: ' + err); },
    //   complete() { console.log('完了'); }
    // });
    // console.log('subscribeから抜けました');

  }

  // getMessages(): any {
  //   return this.comment
  // }


}
