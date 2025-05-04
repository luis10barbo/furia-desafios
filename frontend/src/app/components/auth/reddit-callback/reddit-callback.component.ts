import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-reddit-callback',
  imports: [],
  templateUrl: './reddit-callback.component.html',
  styleUrl: './reddit-callback.component.css'
})
export class RedditCallbackComponent {
  constructor(private authService: AuthService, private notificationService: NotificationService) {
    this.auth();
  }

  auth() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (!state || !code) {
      this.notificationService.show({title: "Erro", description: "Erro ao continuar processo de autorização, faltando parametro local 'state' ou parametro de reddit 'code'"});
      return;
    }

    this.authService.redditAuth(code, state)
  }
}
