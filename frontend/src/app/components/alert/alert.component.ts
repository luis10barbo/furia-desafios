import { Component } from '@angular/core';
import { NotificationType } from '../../models/notificationModel';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  notification?: NotificationType = undefined;
  notificationStatusMessage?: string = undefined;
  constructor(private notificationService: NotificationService) {
    notificationService.notificationObservable.subscribe((notification) => {
      this.notification = notification;
      if (notification.status) {
        this.getStatusCodeMessage(notification.status)
      }
    })
  }
  dismiss() {
    this.notification = undefined;
    this.notificationStatusMessage = undefined
  }

  getStatusCodeMessage(statusCode: number) {
    switch (statusCode) {
      case 200: {
        this.notificationStatusMessage = "Sucesso"
        break;
      }
      case 400: {
        this.notificationStatusMessage = "Request malformulado";
        break;
      }
      case 401: {
        this.notificationStatusMessage = "Não autorizado";
        break;
      }
      case 404: {
        this.notificationStatusMessage = "Não encontrado";
        break;
      }
    }
  }
}
