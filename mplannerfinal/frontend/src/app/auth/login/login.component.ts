import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginFormGrp: FormGroup;

  constructor(private router: Router, public authService: AuthService) {
    if(this.authService.currentUserValue) {
      var currUser = JSON.parse(localStorage.getItem("currentUser"));
      console.log(currUser.username);
    // let currUser = this.authService.currUser.source.value.username;
      let roleIndex = currUser.username.indexOf('-admin');
      if (roleIndex === -1) {
        this.router.navigate(['/uplanner/' + currUser._id]);
      }
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.loginFormGrp = new FormGroup({
      Username: new FormControl('', [
        Validators.required,

      ]),
      Password: new FormControl('', [
        Validators.required
      ])
    });
  }

  onSubmit() {
    if(this.loginFormGrp.invalid) {
      return;
    }
   // console.log(this.loginFormGrp.value);
    this.authService.loginUser(this.loginFormGrp.value.Username, this.loginFormGrp.value.Password);
  }

  onReset() {
    console.log(this.loginFormGrp);
  }

}

