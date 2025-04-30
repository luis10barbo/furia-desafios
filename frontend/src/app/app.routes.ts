import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { KyfComponent } from './components/kyf/kyf.component';
import { KyfProfileComponent } from './components/kyf-profile/kyf-profile.component';

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
        path: "kyf/profile",
        component: KyfProfileComponent
    },
    {
        path: "",
        component: ChatComponent
    }
];
