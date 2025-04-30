import { UserModel } from "./userModel";

export type SessionModel = {
    id: string;
    cookie: string;
  
    userId: string;
    User?: UserModel;
  
    expirationDate?: Date;
  }