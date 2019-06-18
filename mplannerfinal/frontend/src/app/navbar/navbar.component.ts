import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { AuthData } from '../auth/auth-data.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit , OnDestroy{
  navBarOpen = false;

  toggleResMenu(){
    this.navBarOpen = !this.navBarOpen;
  }
  currentUser: AuthData;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.currUser.subscribe(x => this.currentUser = x);
  }


  ngOnInit() {
    let currentUser = this.authService.currentUserValue;
    this.userIsAuthenticated = this.authService.getIsAuth();
    console.log(this.userIsAuthenticated);
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
   // this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
  logout() {
      this.authService.logout();
     // this.router.navigate(['/login']);
  }


}
