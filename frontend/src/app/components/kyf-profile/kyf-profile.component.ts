import { Component } from '@angular/core';
import { KyfService } from '../../services/kyf/kyf.service';
import { UserModel } from '../../models/userModel';
import { HeaderComponent } from "../header/header.component";
import { AuthService } from '../../services/auth/auth.service';
import { NotificationService } from '../../services/notification/notification.service';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-kyf-profile',
  imports: [HeaderComponent, MarkdownModule],
  templateUrl: './kyf-profile.component.html',
  styleUrl: './kyf-profile.component.css'
})
export class KyfProfileComponent {
  user?: UserModel = undefined;
  redditUser?: UserModel["socialMediaLink"][0] = undefined
  isLoading = true;
  constructor(private kyfService: KyfService, private authService: AuthService, private notificationService: NotificationService) {
    kyfService.loadingSubject.subscribe((isLoading) => {
      if (isLoading) {
        return;
      }  
      this.setUser(kyfService.userSubject.getValue());
      if (this.user) { 
        this.isLoading = false;
        return;
      }
      window.location.href = "/kyf"

      

      kyfService.userSubject.subscribe((user) => {
        this.setUser(user);
      }) 
    })
  }

  setUser(user?: UserModel) {
    if (this.user && !this.user.verified) {
      this.gotoVerify();
    }

    this.user = user;
    this.redditUser = user?.socialMediaLink.find((socialMediaLink) => {
      return socialMediaLink.provider === "reddit";
    })
    console.log(this.user);
  }

  async twitterAuth() {
    // const { codeChallenge, state } = await this.authService.generateOAuthParams();

    // const params = new URLSearchParams({
    //   response_type: 'code',
    //   client_id: 'Qm9TT2k0d2dDSy1GS0VpbjhpVUg6MTpjaQ',
    //   redirect_uri: 'http://localhost:4200/auth/twitter', // adjust as needed
    //   scope: 'tweet.read users.read offline.access like.read',
    //   state,
    //   code_challenge: codeChallenge,
    //   code_challenge_method: 'S256'
    // });

    // window.location.href = `https://twitter.com/i/oauth2/authorize?${params}`;
    this.notificationService.show({title: "Erro", description: "Devido às grandes limitações no free Tier da API do TWITTER/X, nós decidimos descontinuar a funcionalidade de logar com o Twitter/X"})
  }

  async redditAuth() {
    const { state } = await this.authService.generateOAuthParams();

    // TODO: put in .env
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: 'YZ-XJOkoR7Zv6R8fTww3gQ',
      redirect_uri: 'http://localhost:4200/auth/reddit', // adjust as needed
      scope: 'identity history read',
      state,
      // code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });
    window.location.href = `https://reddit.com/api/v1/authorize?${params}`;

  }

  gotoVerify() {
    window.location.href = "/kyf/verify"
  }
}
