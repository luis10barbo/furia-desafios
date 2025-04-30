import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { KyfService } from '../../services/kyf/kyf.service';
import { UserModel } from '../../models/userModel';
import { PurchaseModel } from '../../models/purchaseModel';
import { EventModel } from '../../models/eventModel';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-kyf',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './kyf.component.html',
  styleUrl: './kyf.component.css'
})
export class KyfComponent { 
  user?: UserModel = undefined; 
  loading: boolean = true;
  
  constructor(private kyfService: KyfService, private router: Router) {
    // this.user = kyfService.userSubject.getValue();
    kyfService.loadingSubject.subscribe((val) => {
      if (!val) {
        if (kyfService.userSubject.getValue()) {
          this.router.navigate(["/kyf/profile"])
        } else {
          this.loading = false;
        }
      }
    })
  }

  mode: "Login" | "Register" = "Login";

  events: EventModel[] = [];
  purchases: PurchaseModel[] = [];

  @ViewChild('eventsInput') eventsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('purchasesInput') purchasesInput!: ElementRef<HTMLInputElement>;

  loginFormGroup = new FormGroup({
    email: new FormControl(""),
    password: new FormControl(""),
  })

  registerFormGroup = new FormGroup({
    email: new FormControl(""),
    password: new FormControl(""),
    passwordConfirm: new FormControl(""),
    firstName: new FormControl(""),
    lastName: new FormControl(""),
    interests: new FormControl(""),
    state: new FormControl(""),
    city: new FormControl(""),
    neighborhood: new FormControl(""),
    phone: new FormControl("")
  })

  changeEvents(event: Event) {
    this.eventsInput.nativeElement.scrollIntoView({behavior: 'smooth'})

    const currentValue = (event.target as HTMLInputElement).value;
    // TODO: Extremamente ineficiente, gerando id a cada escrevida
    this.events = currentValue.split(",").flatMap((event) => {
      if (event.length < 1) {
        return [];
      }
      const newValue: EventModel = {id: crypto.randomUUID(), name: event, url: ""};
      return newValue;
    });
  
  }

  changePurchases(event: Event) {
    this.purchasesInput.nativeElement.scrollIntoView({behavior: 'smooth'})

    const currentValue = (event.target as HTMLInputElement).value;
    // TODO: Extremamente ineficiente, gerando id a cada escrevida
    this.purchases = currentValue.split(",").flatMap((event) => {
      if (event.length < 1) {
        return [];
      }
      const newValue: EventModel = {id: crypto.randomUUID(), name: event, url: ""};
      return newValue;
    });
  }

  changeMode(mode: "Login" | "Register") {
    this.mode = mode;
  }

  doLogin() {
    this.kyfService.doLogin({email: this.loginFormGroup.value.email!, password: this.loginFormGroup.value.password!})!.subscribe((val) => {
      if (val) {
        this.router.navigate(["/kyf/profile"])
      }
    })
  }

  doRegister() {
    this.kyfService.doRegister({
      email: this.registerFormGroup.value.email!,
      password: this.registerFormGroup.value.password!, 
      first_name: this.registerFormGroup.value.firstName!, 
      last_name: this.registerFormGroup.value.lastName!, 
      state: this.registerFormGroup.value.state!,
      city: this.registerFormGroup.value.city!,
      neighborhood: this.registerFormGroup.value.neighborhood!,
      phone: this.registerFormGroup.value.phone!,
      interests: this.registerFormGroup.value.interests!,
      events: this.events,
      purchases: this.purchases
    })!.subscribe((val) => {
      if (val) {
        this.router.navigate(["/kyf/profile"])
      }
    })
  }

  getUser() {
    this.kyfService.getUser().subscribe((val) => {
      this.user = val;
    });
  }
}
