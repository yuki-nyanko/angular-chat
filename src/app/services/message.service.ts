import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../class/comment';

@Injectable()
export class MessageService {

  constructor(private http: HttpClient) { }

  getMessages(): Observable<any> {
    return this.http.get('/api/v1/chats/get')
  }

  addMessages(chat: any): Observable<any> {
    return this.http.post('/api/v1/chats/add', chat);
  }

  editMessages(chat: any): Observable<any> {
    return this.http.post('/api/v1/chats/edit', chat);
  }

  deleteMessages(chat: any): Observable<any> {
    return this.http.post('/api/v1/chats/delete', chat);
  }
}
