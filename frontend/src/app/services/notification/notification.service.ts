import { NotificationType } from '@/app/models/notificationModel';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notificationObservable: Subject<NotificationType> = new Subject<NotificationType>();

  constructor() { }

  show(notification: NotificationType) {
    this.notificationObservable.next(notification);
  }
}
