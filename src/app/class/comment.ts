import { User } from './user';

export class Comment {

  date: number;
  user: User;

  // constructor(public user: User, public message: string, public id?: string) {
  constructor(public uid: number, public name: string, public message: string, public _id?: string) {
    this.date = Date.now();
  }

}
