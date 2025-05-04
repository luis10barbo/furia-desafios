import { NotificationService } from '@/app/services/notification/notification.service';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-twitter-callback',
  imports: [],
  templateUrl: './twitter-callback.component.html',
  styleUrl: './twitter-callback.component.css'
})
export class TwitterCallbackComponent {
  constructor(private httpClient: HttpClient, private notificationService: NotificationService) {}

  ngOnInit() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const savedState = sessionStorage.getItem('oauth_state');
    const codeVerifier = sessionStorage.getItem('pkce_code_verifier');

    if (state !== savedState || !code || !codeVerifier) {
      console.error('Invalid state or missing code/verifier');
      return;
    }

    this.httpClient.post(`${environment.BACKEND}/auth/twitter`, { code, code_verifier: codeVerifier }, {withCredentials: true}).pipe(catchError((err) => {
      console.log(err);
      this.notificationService.show({title: "Erro ao autorizar twitter", description: err});
      return err;
    })).subscribe((response) => {

    });
  }
}
