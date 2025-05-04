import { BACKEND } from '@/app/constants';
import { UserModel } from '@/app/models/userModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class KyfService {
  userSubject = new BehaviorSubject<UserModel | undefined>(undefined);
  loadingSubject = new BehaviorSubject<boolean>(true);

  constructor(private httpClient: HttpClient, private notificationService: NotificationService) {
    this.getUser().subscribe((val) => {
      this.userSubject.next(val);
      this.loadingSubject.next(false);
    })
  }

  doLogin(login: {email: string, password: string}) {
    return this.httpClient.post<UserModel>(`${BACKEND}/kyf/login`, login, {withCredentials: true}).pipe(catchError((err) => {
      this.notificationService.show({description: err.error, title: "Erro ao logar"});
      return throwError(() => err);
    }));
  }

  doRegister(login: UserModel) {
    return this.httpClient.post<UserModel>(`${BACKEND}/kyf/register`, login, {withCredentials: true}).pipe(catchError((err) => {
      this.notificationService.show({description: err.error, title: "Erro ao registrar"});

      return throwError(() => err);
    }));
  }

  doLogout() {
    return new Observable((sub) => {
      return this.httpClient.post(`${BACKEND}/kyf/logout`, null, {withCredentials: true}).subscribe((val) => {
        this.userSubject.next(undefined);
        sub.next(val);
      });
    })
  }

  getUser() {
    return new Observable<UserModel>((sub) => {
      return this.httpClient.get<UserModel>(`${BACKEND}/kyf/user`, {withCredentials: true}).subscribe((val) => {
        this.userSubject.next(val);
        sub.next(val);
      });
    });
  }

  setUser(user: UserModel) {
    this.userSubject.next(user);
  }

  submitDocument(front: File, back: File) {
    const form = new FormData();
    form.set("frontDocument", front);
    form.set("backDocument", back);
    return this.httpClient.post(`${BACKEND}/kyf/document`, form, {withCredentials: true}).pipe(catchError(err => {
      this.notificationService.show({description: err.error, title: "Erro ao validar documento"});

      return throwError(() => err);
    }));
  }
}
