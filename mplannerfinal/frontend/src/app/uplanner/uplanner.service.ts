import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Events } from './uplanner-data.model';
import { Subject, Observable } from 'rxjs';
import { NotificationService } from '../event-notifications/notification.service';
@Injectable({ providedIn: 'root' })

export class UplannerService {
  private ifLoggedIn = false;
  // store boolean yes or no for if the user is authenticated or not rather than the token
  private authStatusListener = new Subject<boolean>();
  private token: string;
  constructor(
      private http: HttpClient,
      private router: Router,
      private notificationService: NotificationService
    ) {}

  getToken() {
      return this.token;
  }
  getIsAuth() {
    return this.ifLoggedIn;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  // return only observable part of the auth listener
  getLoginStatus(){
    return this.authStatusListener.asObservable();
  }

  saveNewEvent(event: Events, userId: String, isUpdate = false) {
    console.log(event);
    console.log(userId);
    this.http.post('http://13.233.94.60:3000/api/event/save', event)
    .subscribe(res => {
      console.log('res-----', res);
      this.notificationService.sentNotification(userId, isUpdate ? 'event updated' : 'event added', event);
      setTimeout(()=>{
          window.location.reload();
      }, 200)
    })
}

  deleteSelectedEvent(event: Events, userId: String) {
    console.log(event);
    this.http.post('http://13.233.94.60:3000/api/event/delete', event)
    .subscribe(res => {
        console.log('res', res);
        window.location.reload();
        this.notificationService.sentNotification(userId, 'event removed', event);

        // window.location.reload();
    })
}
  getEventsForUser(id: string){
      return this.http.get('http://13.233.94.60:3000/api/event/'+id);
  }

}
