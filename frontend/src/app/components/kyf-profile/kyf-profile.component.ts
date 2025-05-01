import { Component } from '@angular/core';
import { KyfService } from '../../services/kyf/kyf.service';
import { UserModel } from '../../models/userModel';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-kyf-profile',
  imports: [HeaderComponent],
  templateUrl: './kyf-profile.component.html',
  styleUrl: './kyf-profile.component.css'
})
export class KyfProfileComponent {
  user?: UserModel
  isLoading = true;
  constructor(private kyfService: KyfService) {
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
