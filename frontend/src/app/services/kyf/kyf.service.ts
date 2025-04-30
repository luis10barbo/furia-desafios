import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BACKEND } from '../../constants';
import { UserModel } from '../../models/userModel';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class KyfService {
  userSubject = new BehaviorSubject<UserModel | undefined>(undefined);
  loadingSubject = new BehaviorSubject<boolean>(true);

  constructor(private httpClient: HttpClient, private alertService: AlertService) {
    this.getUser().subscribe((val) => {
      this.userSubject.next(val);
      this.loadingSubject.next(false);
    })
  }

  doLogin(login: {email: string, password: string}) {
    return this.httpClient.post(`${BACKEND}/kyf/login`, login, {withCredentials: true}).pipe(catchError((err) => {
      this.alertService.doAlert(err.error);
      return throwError(() => err);
    }));
  }

  doRegister(login: UserModel) {
    return this.httpClient.post(`${BACKEND}/kyf/register`, login, {withCredentials: true}).pipe(catchError((err) => {
      this.alertService.doAlert(err.error);
      return throwError(() => err);
    }));
  }

  doLogout() {
    return this.httpClient.post(`${BACKEND}/kyf/logout`, null, {withCredentials: true});
  }

  getUser() {
    return this.httpClient.get<UserModel>(`${BACKEND}/kyf/user`, {withCredentials: true});
  }

  setUser(user: UserModel) {
    this.userSubject.next(user);
  }

}
