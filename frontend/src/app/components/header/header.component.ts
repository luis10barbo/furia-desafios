import { Component, Input } from '@angular/core';
import { KyfService } from '../../services/kyf/kyf.service';
import { UserModel } from '../../models/userModel';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  user?: UserModel = undefined;
  isLoading: boolean = true;

  @Input("exit-href")
  exitHref: string = "";

  constructor(private kyfService: KyfService) {
    kyfService.loadingSubject.subscribe((isLoading) => {
      if (isLoading) {
        return;
      }  
      this.user = kyfService.userSubject.getValue();
      if (this.user) { 
        this.isLoading = false;
        return;
      }

      kyfService.userSubject.subscribe((user) => {
        this.user = user;
      }) 
    })
  }

  exitRedirect() {
    if (this.exitHref.length < 1) {
      return;
    }
    window.location.href = this.exitHref;
  }

  doLogout() {
    this.kyfService.doLogout().subscribe(() => {
      this.exitRedirect();
    });
  }
}
