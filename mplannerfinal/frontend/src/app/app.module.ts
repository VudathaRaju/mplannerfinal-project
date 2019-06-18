import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import {ReactiveFormsModule, FormsModule } from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import {NgBootstrapFormValidationModule} from 'ng-bootstrap-form-validation';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthInterceptors } from './auth/auth-interceptor';
import { NavbarComponent } from './navbar/navbar.component';
import { UplannerComponent } from './uplanner/uplanner.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ErrorpagesComponent } from './errorpages/errorpages.component';
import { SchedulerModule } from 'sw-scheduler';
import { SnoozeConfirmationComponent } from './modals/snooze-confirmation/snooze-confirmation.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent ,
    SignupComponent,
    DashboardComponent,
    NavbarComponent,
    UplannerComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    ErrorpagesComponent,
    SnoozeConfirmationComponent
  ] ,
  imports: [
     BrowserModule,
     BrowserAnimationsModule,
     AppRoutingModule,
     SchedulerModule,
     NgbModule,
     AngularFontAwesomeModule,
     FullCalendarModule,
     ReactiveFormsModule,
     FormsModule,
     HttpClientModule,
     NgBootstrapFormValidationModule.forRoot(),
     NgBootstrapFormValidationModule,
     CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ToastrModule.forRoot() // ToastrModule added
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptors,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
