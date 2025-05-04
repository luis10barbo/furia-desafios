import { EventModel } from '@/app/models/eventModel';
import { PurchaseModel } from '@/app/models/purchaseModel';
import { UserModel } from '@/app/models/userModel';
import { KyfService } from '@/app/services/kyf/kyf.service';
import { uuidv4 } from '@/app/utils/uuid';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';



@Component({
  selector: 'app-kyf',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './kyf-home.component.html',
  styleUrl: './kyf-home.component.css'
})
export class KyfComponent { 
  user?: UserModel = undefined; 
  loading: boolean = true;
  
  constructor(private kyfService: KyfService, private router: Router) {
    // this.user = kyfService.userSubject.getValue();
    kyfService.loadingSubject.subscribe((val) => {
      
      if (!val) {
        if (kyfService.userSubject.getValue()) {
          this.gotoProfile();
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

  gotoProfile() {
    window.location.href = "/kyf/profile";
  }

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
      const newValue: EventModel = {id: uuidv4(), name: event, url: ""};
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
      const newValue: EventModel = {id: uuidv4(), name: event, url: ""};
      return newValue;
    });
  }

  changeMode(mode: "Login" | "Register") {
    this.mode = mode;
  }

  doLogin() {
    this.kyfService.doLogin({email: this.loginFormGroup.value.email!, password: this.loginFormGroup.value.password!})!.subscribe((val) => {
      if (val) {
        this.gotoProfile();
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
      purchases: this.purchases,
      verified: false,
      socialMediaLink: [],
      socialMediaPost: []
    })!.subscribe((val) => {
      if (val) {
        this.gotoProfile();
      }
    })
  }

  getUser() {
    this.kyfService.getUser().subscribe((val) => {
      this.user = val;
    });
  }
}
