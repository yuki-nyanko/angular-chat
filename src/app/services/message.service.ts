import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../class/comment';

@Injectable()
export class MessageService {

  constructor(private http: HttpClient) { }

  getMessages(): Observable<any> {
    return this.http.get('/api/comment/get')
  }

  addMessages(addComment: Comment): Observable<any> {
    return this.http.post('/api/comment/regist', addComment)
  }
}
