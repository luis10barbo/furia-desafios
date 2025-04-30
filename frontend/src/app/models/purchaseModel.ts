import { UserModel } from "./userModel";

export type PurchaseModel = {
    id: string;
    name: string;
    url: string;
    image?: string;
  
    User?: UserModel;
  }