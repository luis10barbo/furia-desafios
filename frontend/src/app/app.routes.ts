import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { TwitterCallbackComponent } from './components/auth/twitter-callback/twitter-callback.component';
import { UnlinkComponent } from './components/unlink/unlink.component';
import { RedditCallbackComponent } from './components/auth/reddit-callback/reddit-callback.component';
import { KyfComponent } from './components/kyf/kyf-home/kyf-home.component';
import { KyfProfileComponent } from './components/kyf/kyf-profile/kyf-profile.component';
import { KyfVerifyComponent } from './components/kyf/kyf-verify/kyf-verify.component';

export const routes: Routes = [
    {
        path: "chat",
        component: ChatComponent
    },
    {
        path: "kyf",
        component: KyfComponent
    },
    {
        path: "kyf/verify",
        component: KyfVerifyComponent
    },
    {
        path: "kyf/profile",
        component: KyfProfileComponent
    },
    {
        path: "",
        component: ChatComponent
    },
    {
        path: "auth/reddit",
        component: RedditCallbackComponent
    },
    {
        path: "user/unlink",
        component: UnlinkComponent
    }
];
