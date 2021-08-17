import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MessageService {

  constructor(private http: HttpClient) { }

  getMessages(): Observable<any> {
    return this.http.get('/api/port')
  }
}
