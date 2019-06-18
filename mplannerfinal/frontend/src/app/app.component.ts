import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from './event-notifications/notification.service';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { SnoozeConfirmationComponent } from './modals/snooze-confirmation/snooze-confirmation.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('modal') modal: SnoozeConfirmationComponent;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private toastr: ToastrService
  ) { }


  title = 'mplanner';
  calendarPlugins = [dayGridPlugin]; // important!

  ngOnInit() {
    this.authService.autoAuthUser();
    this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.notificationService.init();
        } else {
          // stop connection.
          // this.notificationService.stop();
        }
      });

    this.notificationService.init();
    this.notificationService.onNotification.subscribe((notificaiton) => {
      if (notificaiton && !notificaiton.isSnooze) {
        this.showNotificaiton(notificaiton)
      } else {
        this.showSnooze(notificaiton);
      }
    });
  }

  showNotificaiton(notificaiton: any): void {
    if (notificaiton && notificaiton.info && notificaiton.info.message === 'event added') {
      this.toastr.success(`New Event "{${notificaiton.info.event.title}}" added`, 'Event Added');
    } else if (notificaiton && notificaiton.info && notificaiton.info.message === 'event removed') {
      this.toastr.info(`Event ${notificaiton.info.event.title} removed`, 'Event Removed');
    } else if (notificaiton && notificaiton.info && notificaiton.info.message === 'event updated') {
      this.toastr.info(`Event ${notificaiton.info.event.title} updated`, 'Event Updated');
    }
  }

  showSnooze(params: any): void {
    const date = new Date();
    date.setSeconds(0)
    const date2 = new Date(date);
    date2.setMinutes(date2.getMinutes() + 1);
    date2.setSeconds(0)
    if (
      date < new Date(params.info.event.start) && new Date(date2) > new Date(params.info.event.start)) {
      this.modal.openModal(params.info.event, 1);
    }
  }

  onAddSnooze(params: any): void {
    const { event, count } = params;
    this.addSnooze(event, count, false);
  }

  addSnooze(event: any, count: number, repeat = false): void {
    setTimeout(() => {
      if (!repeat && count <= 3) {
        this.modal.openModal(event, count);
      }
    }, 1000 * 5);
  }
}
