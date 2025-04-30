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
  constructor(private kyfService: KyfService, private router: Router) {}
  doLogout() {
    this.kyfService.doLogout().subscribe();
    this.router.navigate(["/kyf"]);
  }
}
