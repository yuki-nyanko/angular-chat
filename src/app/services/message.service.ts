import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../class/comment';

@Injectable()
export class MessageService {

  constructor(private http: HttpClient) { }

  getMessages(): Observable<any> {
    debugger
    return this.http.get('/api/v1/chats/get')
  }

  // addMessages(addComment): Observable<any> {
  //   debugger
  //   return this.http.post('/api/comment/regist', addComment)
  // }
  addMessages(chat: any): Observable<any> {
    return this.http.get('/api/v1/chats/add', chat);
  }
}
