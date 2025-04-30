import { UserModel } from "./userModel";

export type EventModel = {
    id: string;
    name: string;
    url: string;
    image?: string;
  
    User?: UserModel;
  }