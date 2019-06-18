import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthData, UserData } from '../auth/auth-data.model';;
import { AuthInterceptors } from '../auth/auth-interceptor';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'user-list',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  users: AuthData[] = [];
  private userSub: Subscription;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  totalUsers = 0;
  usersPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [5, 10];
  isLoading = false;
  constructor( private http: HttpClient, private router: Router, private authService: AuthService,private toastr: ToastrService) {
    if(!this.authService.currentUserValue) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    var currUser = JSON.parse(localStorage.getItem("currentUser"));
    console.log(currUser.username);
   // let currUser = this.authService.currUser.source.value.username;
    let roleIndex = currUser.username.indexOf('-admin');
    if (roleIndex === -1) {
      this.toastr.error('Unauthorized Access');
      this.router.navigate(['/uplanner/' + currUser._id]);
    }
    this.authService.getUsers(this.usersPerPage, this.currentPage);
    this.userSub = this.authService
      .getUserUpdateListener()
      .subscribe((userData: { users: AuthData[]; userCount: number }) => {
        this.isLoading = false;
        this.totalUsers = userData.userCount;
        this.users = userData.users;
        console.log(this.users);
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
        });
  }
}
