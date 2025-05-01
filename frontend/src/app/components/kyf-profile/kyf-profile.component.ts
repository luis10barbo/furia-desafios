import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { routes } from '../../app.routes';
import { KyfService } from '../../services/kyf/kyf.service';

@Component({
  selector: 'app-kyf-profile',
  templateUrl: './kyf-profile.component.html',
  styleUrl: './kyf-profile.component.css',
  imports: [RouterModule]
})
export class KyfProfileComponent {
  loading = true;
  constructor(private kyfService: KyfService, private router: Router) {
    kyfService.loadingSubject.subscribe((isLoading) => {
      if (isLoading) {
        return;
      }  
      if (kyfService.userSubject.getValue()) { 
        return;
      }
      this.gotoMainPage();
    })
  }

  gotoMainPage() {
    this.router.navigate(["/kyf"]);
  }

  doLogout() {
    this.kyfService.doLogout().subscribe();
    this.gotoMainPage();
  }
}
