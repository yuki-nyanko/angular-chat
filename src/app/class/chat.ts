import { User } from './user'

export class Chat {

  private date : number;
  private user : User;
  public isEdit : boolean;
  public uid : number;
  public message : string;
  public id : string;

  constructor(public userId: number, public chat: string){
    this.date = Date.now();
    this.isEdit = true;
    this.uid = userId;
  }


}
