import { UserModel } from '@/app/models/userModel';
import { AuthService } from '@/app/services/auth/auth.service';
import { KyfService } from '@/app/services/kyf/kyf.service';
import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-unlink',
  imports: [HeaderComponent],
  templateUrl: './unlink.component.html',
  styleUrl: './unlink.component.css'
})
export class UnlinkComponent {
  user?: UserModel;
  isLoading = true;

  constructor(private kyfService: KyfService, private authService: AuthService) {
      kyfService.loadingSubject.subscribe((isLoading) => {
        if (isLoading) {
          return;
        }  
        this.user = kyfService.userSubject.getValue();
        if (this.user) { 
          this.isLoading = false;
          if (!this.user.verified) {
            this.gotoVerify();
          }
          return;
        }
        window.location.href = "/kyf"
  
        
  
        kyfService.userSubject.subscribe((user) => {
          this.user = user;
        }) 
      })
    }

    gotoVerify() {
      window.location.href = "/kyf/verify"
    }
}
