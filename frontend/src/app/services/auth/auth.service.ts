import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { BACKEND } from '@/app/constants';
import { NotificationService } from '../notification/notification.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private notificationService: NotificationService) { }

  async generateOAuthParams() {
    const codeVerifier = this.base64URLEncode(crypto.getRandomValues(new Uint8Array(32)));
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    const state = this.base64URLEncode(crypto.getRandomValues(new Uint8Array(16)));

    sessionStorage.setItem('pkce_code_verifier', codeVerifier);
    sessionStorage.setItem('oauth_state', state);

    return { codeChallenge, state };
  }

  private base64URLEncode(buffer: ArrayBuffer | Uint8Array) {
    const bytes = new Uint8Array(buffer);
    return btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return this.base64URLEncode(digest);
  }

  redditAuth(code: string, state: string) {
    
    const savedState = sessionStorage.getItem('oauth_state');
    const codeVerifier = sessionStorage.getItem('pkce_code_verifier');

    if (state !== savedState || !codeVerifier) {
      console.error('Invalid state or missing code/verifier');
      return;
    }

    this.httpClient.post(`${BACKEND}/auth/reddit`, { code, code_verifier: codeVerifier }, {withCredentials: true}).pipe(catchError((err) => {
      this.notificationService.show({title: "Erro ao autorizar Reddit", description: JSON.stringify(err)});
      return err;
    })).subscribe((response) => {
      window.location.href = "/kyf/profile";
    });
  }
}
