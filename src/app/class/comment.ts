import { User } from './user';

export class Comment {

  date: number;

  constructor(public user: User, public message: string) {
    this.date = Date.now();
  }

}
