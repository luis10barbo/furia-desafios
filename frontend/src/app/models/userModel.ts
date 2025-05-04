import { PurchaseModel } from "./purchaseModel";
import { SessionModel } from "./sessionModel";
import { EventModel } from "./eventModel";

export type SocialMedia = "reddit" | "twitter";
export type UserModel = {
    id?: string;
    email: string;
    password: string;
  
    first_name: string;
    last_name: string;
  
    phone: string;
  
    state: string;
    city: string;
    neighborhood: string;
  
    interests: string;
  
    purchases: PurchaseModel[];  // Assuming Purchase is another interface
    events: EventModel[];        // Assuming Event is another interface
  
    session?: SessionModel;      // Assuming Session is another interface
    verified: boolean;
    socialMediaPost: {id: string, postUrl: string, postTitle?: string, postDescription?: string, socialMedia: SocialMedia, interactionType: string}[] 
    socialMediaLink: {id: string, provider: SocialMedia, accessToken: string, refreshToken: string | null, expirationDate: string, providerUserId: string, providerUserNickname: string, providerUserEmail: string | null, providerUserUrl: string}[]
  }