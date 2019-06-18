import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import * as angular from 'angular';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  signupFormGrp: FormGroup;
  loading = false;

  public items;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService ) {
   this.items = [];
   if(this.authService.currentUserValue) {
    this.router.navigate(['/dashboard']);
  }
}

  ngOnInit() {
    this.signupFormGrp = new FormGroup({
      FirstName: new FormControl('', [
        Validators.required
      ]),
      LastName: new FormControl('', [
        Validators.required
      ]),
      CountryCode: new FormControl('', [

      ]),
      Phone: new FormControl('', [
        Validators.required
      ]),
      Email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      Username: new FormControl('', [
        Validators.required
      ]),
      Password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });

    //Fetch country codes
    this.http.get('../../assets/json/phone.json').subscribe(
      data => {
        for (let k in data) {
              this.items.push(data[k]);
        }
      },
      (err: HttpErrorResponse) => {
        console.log (err.message);
      }
    );
  }


  onSubmit( ) {

    if(this.signupFormGrp.invalid) {
      return;
    }
    this.loading = true;

    //console.log(this.signupFormGrp.value);
    console.log(this.signupFormGrp.value);
    this.authService.createNewUser(this.signupFormGrp.value.FirstName,
      this.signupFormGrp.value.LastName,
      this.signupFormGrp.value.Email,
      this.signupFormGrp.value.CountryCode,
      this.signupFormGrp.value.Phone,
      this.signupFormGrp.value.Username,
      this.signupFormGrp.value.Password)
      .subscribe(
        data => {
            this.router.navigate(['/login']);
        });

  }

  onReset() {
    console.log(this.signupFormGrp);
  }

}

//angular.module('myApp',[]);
function TodoCtrl($choice) {


}
