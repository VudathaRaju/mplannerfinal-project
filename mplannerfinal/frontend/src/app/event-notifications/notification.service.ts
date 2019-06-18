import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { Events } from './../uplanner/uplanner-data.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  onNotification: Subject<any> = new Subject();

  socket;

  constructor(private authService: AuthService) {
    this.socket = io('http://13.233.94.60:3000');
  }

  init(): void {

    this.socket.on('notification', (info) => {
      const authInfo = this.authService.getAuthData();
      let userId;
      if(authInfo && authInfo.user){
        userId = JSON.parse(authInfo.user)._id;
      }

      if(userId === info.userId) {
        info
        this.onNotification.next({ info });
      }

    });

    this.socket.on('snooze', (info) => {
      const authInfo = this.authService.getAuthData();
      let userId;
      if(authInfo && authInfo.user){
        userId = JSON.parse(authInfo.user)._id;
      }

      if(userId === info.userId) {
        this.onNotification.next({ info, isSnooze: true });
      }

    })
  }


  sentNotification(userId: String, message: String, event: Events): void {
    this.socket.emit('event-update', { userId, message, event });
  }
}
