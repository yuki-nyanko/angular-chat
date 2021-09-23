import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { Comment } from '../class/comment';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { disableDebugTools } from "@angular/platform-browser";

@Injectable()
export class MessageService {

  constructor(private http: HttpClient) { };
  socket: Socket

  connect(chatId) {
    this.socket = io();
    this.socket = io(environment.SOCKET_ENDPOINT)
    // this.socket.emit('joinChat', { "Test": "test" })
    this.socket.emit('selectMessages', { chatId });
  };

  selectMessages(chatId) {
    this.socket.emit('selectMessages', { chatId });
  };

  reciveSelectMessages() {
    return new Observable((observer) => {
      this.socket.on("reciveSelectMessages", (messages) => {
        observer.next(messages);
      });
    })
  };

  getMessages(chatId): Observable<any> {
    // return this.http.get('/api/v1/chats/get')
    return new Observable((observer) => {
      this.socket.emit('getMessages');
      this.socket.on("reciveMessages", (messages) => {
        observer.next(messages);
      });
    });
  };

  addMessages(chatId, chat) {
    // addMessages(chat: any): Observable<any> {
    // addMessages(chat: any): void {
    // return this.http.post('/api/v1/chats/add', chat);
    // Socket.ioサーバへ送信
    this.socket.emit('addMessages', { chatId, chat: chat });
  };

  reciveSendMessages() {
    return new Observable((observer) => {
      this.socket.on("reciveSendMessages", (messages) => {
        observer.next(messages);
      });
    });
  };

  // editMessages(chat: any): Observable<any> {
  editMessages(chatId, chat) {
    // return this.http.post('/api/v1/chats/edit', chat);
    this.socket.emit('editMessages', { chatId, chat: chat });
    return new Observable((observer) => {
      this.socket.on('reciveEditMessage', (messages) => {
        observer.next(messages);
      });
    });
  };

  // deleteMessages(chat: any): Observable<any> {
  deleteMessages(chat: any) {
    // return this.http.post('/api/v1/chats/delete', chat);
    this.socket.emit('deleteMessages', chat);
  };

  reciveDeleteMessages() {
    return new Observable((observer) => {
      this.socket.on('reciveEditMessage', (messages) => {
        observer.next(messages);
      });
    });
  };

};
