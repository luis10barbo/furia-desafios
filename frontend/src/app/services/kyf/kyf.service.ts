import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BACKEND } from '../../constants';
import { UserModel } from '../../models/userModel';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KyfService {
  userSubject = new BehaviorSubject<UserModel | undefined>(undefined);
  loadingSubject = new BehaviorSubject<boolean>(true);

  constructor(private httpClient: HttpClient) {
    this.getUser().subscribe((val) => {
      this.userSubject.next(val);
      this.loadingSubject.next(false);
    })
  }

  doLogin(login: {email: string, password: string}) {
    return this.httpClient.post(`${BACKEND}/kyf/login`, login, {withCredentials: true});
  }

  doRegister(login: UserModel) {
    return this.httpClient.post(`${BACKEND}/kyf/register`, login, {withCredentials: true});
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
