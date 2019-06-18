import { NgModule } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, subMonths, addMonths, addWeeks, subWeeks, startOfWeek, startOfMonth, endOfWeek } from 'date-fns';
import { CalendarEvent,  CalendarEventAction, CalendarEventTimesChangedEvent,  CalendarView } from 'angular-calendar';
import { UplannerService } from './uplanner.service';
import { Observable } from 'rxjs';
import { Events } from './uplanner-data.model';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';

type CalendarPeriod = 'day' | 'week' | 'month';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

function incPeriod(period: CalendarPeriod, date: Date, duration: number): Date {
  return {
    month: addMonths, week: addWeeks,  day: addDays
  }[period](date, duration);
}

function decPeriod(period: CalendarPeriod, date: Date, duration: number): Date {
  return {
    day: subDays,  week: subWeeks,  month: subMonths
  }[period](date, duration);
}

function startPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    month: startOfMonth,
    week: startOfWeek,
    day: startOfDay
  }[period](date);
}

function endPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    month: endOfMonth,
    week: endOfWeek,
    day: endOfDay
  }[period](date);
}

@Component({
  selector: 'app-uplanner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './uplanner.component.html',
  styleUrls: ['./uplanner.component.css']
})
export class UplannerComponent {
  minDate: Date = new Date(new Date().getFullYear(), 0, 1);
  maxDate: Date = new Date(new Date().getFullYear(), 11, 31);
  prevBtn: boolean = false;

  nextBtn: boolean = false;
  @ViewChild('modalContent', { }) modalContent: TemplateRef<any>;
  isAdd = false;
  isDelete = false;
  isEdit = false;
  model;
  view: CalendarView = CalendarView.Month;

  //roleedit: false;
  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };
  data = {
    purpose: '',
    place: ''
  };

  currentDate = new Date();
  time;

  maxDatePicker = {
    day: 31,
    month: 12,
    year: this.currentDate.getFullYear()
  };
  minDatePicker = {
    day: this.currentDate.getDate(),
    month: this.currentDate.getMonth() + 1,
    year: this.currentDate.getFullYear()
  };

  eventToServer;
  actions = [
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        const deleteEvent = this.myEvents.filter(iEvent => iEvent !== event);
        this.isAdd = false;
        this.isDelete = true;
        this.isEdit = false;
        this.eventToServer = deleteEvent;
        this.handleEvent('Delete', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.isAdd = false;
        this.isDelete = false;
        this.isEdit = true;
        this.eventToServer = event;
        const title = event.title.split(' at ');
        const date = new Date(event.start);
        this.data.purpose = title[0],
          this.data.place = title[1];
        this.model = {
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear()
        };
        this.time = {
          hour: date.getHours(),
          minute: date.getMinutes(),
          second: 0
        };
        this.handleEvent('Edit', event);
      }
    }
  ];
  id: string;

  isValidDate(date: Date): boolean {
    return date >= this.minDate && date <= this.maxDate;
  }
  viewdecrement(): void {
    this.changeDate(decPeriod(this.view, this.viewDate, 1));
  }
  viewincrement(){
    this.changeDate(incPeriod(this.view, this.viewDate, 1));
  }

  today(): void {
    this.changeDate(new Date());
  }

  refresh: Subject<any> = new Subject();
  tmp: Array<CalendarEvent<{ events: Events }>> = [];
  events: Observable<Array<CalendarEvent<{ events: Events }>>> = new Observable();
  myEvents: Array<CalendarEvent<Events>> = [];

  activeDayIsOpen: boolean = false;
  roleedit: boolean = false;
  ngOnInit() {


    console.log(this.minDate);

    var currUser = JSON.parse(localStorage.getItem("currentUser"));
    console.log(currUser.username);
   // let currUser = this.authService.currUser.source.value.username;
    let roleIndex = currUser.username.indexOf('-admin');
    if (roleIndex === -1) {
      this.actions = [];
      this.roleedit = false;
      this.activatedRoute.params
      .subscribe((params: any) => {
        console.log('id--', params.id);
        if(params.id != currUser._id) {
          this.toastr.error('Unauthorized Access');
          this.router.navigate(['/uplanner/' + currUser._id]);
        }

      });

    } else {
      this.roleedit = true;
    }

    this.id = this.route.snapshot.paramMap.get("id");
    this.events = this.uplannerService.getEventsForUser(this.id)
      .pipe(
        map(({ results }: { results: Events[] }) => {
        return results.map((r) => {
          this.myEvents.push(<CalendarEvent>{
            title: r.title,
            start: new Date(r.start),
            color: r.color,
            allDay: true,
            draggable: r.draggable,
            resizable: r.resizable,
            end: new Date(r.end),
			actions: this.actions,
            meta: {
              r
            }
          });

          return <CalendarEvent>{
            title: r.title,
            start: new Date(r.start),
            color: r.color,
            allDay: true,
            draggable: r.draggable,
            resizable: r.resizable,
            end: new Date(r.end),
			actions: this.actions,
            meta: {
              r
            }
          };
        })
      }))
    // this.uplannerService.getEventsForUser(this.id).then(res => {
    //   res.results.forEach(result => {
    //     self.events.push(result);
    //   });
    // });

    // this.events = this.uplannerService.getEventsForUser(this.id)
    //   .pipe( res => {
    //     return res.map((each:CalendarEvent<Events>) => {
    //       console.log(each)
    //     });
    //   });

    //   this.events = this.http
    //   .get('http://13.233.94.60:3000/api/event/'+this.id)
    //   .pipe(
    //     map(({results} : {results:Events[]}) => {
    //         return <CalendarEvent>event;
    //     })
    //   );
  }
  constructor(
     private modal: NgbModal,
     private route: ActivatedRoute,
     private toastr: ToastrService,
     private activatedRoute : ActivatedRoute,
     private uplannerService: UplannerService,
     private authService: AuthService,
     private router: Router,

     private http: HttpClient) {
       this.dateChanged();
       if(!this.authService.currentUserValue) {
        this.router.navigate(['/login']);
      }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    // this.events = this.events.map(iEvent => {
    //   if (iEvent === event) {
    //     return {
    //       ...event,
    //       start: newStart,
    //       end: newEnd
    //     };
    //   }
    //   return iEvent;
    // });
    // this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    if (action === 'Edit') {
      this.modal.open(this.modalContent, { size: 'lg' });
      this.eventToServer = event;
    } else {
      this.eventToServer = null;
      this.deleteEvent(event);
    }
  }

  handleAddEvent(action: string) {
    this.isAdd = true;
    this.isDelete = false;
    this.isEdit = false;
    this.eventToServer = null;

    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    const update = JSON.parse(JSON.stringify(this.model));
    const time = JSON.parse(JSON.stringify(this.time));
    let event: Events;
    event = {
      id: this.id,
      title: this.data.purpose + ' at ' + this.data.place,
      start: new Date(update.year, update.month - 1 , update.day, time.hour, time.minute, 0),
      end: new Date(update.year, update.month - 1, update.day, time.hour, time.minute, 0),
      color: colors.red,
      draggable: true,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    };

    this.uplannerService.saveNewEvent(event, this.id);
    // this.events = this.getMyEvents(this.myEvents);

    console.log(this.myEvents)
  }

//save new event
  saveEvent(eventToSave: Events) {
    const update = JSON.parse(JSON.stringify(this.model));
    const time = JSON.parse(JSON.stringify(this.time));
    eventToSave.title = this.data.purpose + ' at ' + this.data.place,
    eventToSave.start = new Date(update.year, update.month - 1, update.day, time.hour, time.minute, 0);
    eventToSave.end = new Date(update.year, update.month - 1, update.day, time.hour, time.minute, 0);
     this.uplannerService.saveNewEvent(eventToSave, this.id,true);
  }

  //delete new event
  deleteEvent(eventToDelete: any) {
  //  this.events = this.events.filter(event => event !== eventToDelete);
    this.uplannerService.deleteSelectedEvent(eventToDelete, this.id);
  }


  setView(view: CalendarView) {
    this.view = view;
  }

  //close any activity opened
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    console.log(this.view);
  }

  changeDate(date: Date): void {
    this.viewDate = date;
    this.dateChanged();
  }



  dateChanged(): void {
    this.prevBtn = !this.isValidDate(
      endPeriod(this.view, decPeriod(this.view, this.viewDate, 1))
    );
    this.nextBtn = !this.isValidDate(
      startPeriod(this.view, incPeriod(this.view, this.viewDate, 0))
    );
    if (this.viewDate < this.minDate) {
      this.changeDate(this.minDate);
    } else if (this.viewDate > this.maxDate) {
      this.changeDate(this.maxDate);
    }
  }

  closeDialog() {
    this.modal.dismissAll();
    this.eventToServer = null;
	}
}
