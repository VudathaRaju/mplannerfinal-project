import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  forgetPasswordFormGrp: FormGroup;

  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit() {
    this.forgetPasswordFormGrp = new FormGroup({
      Username: new FormControl('', [
        Validators.required,
      ])
    });
  }

  onSubmit() {
    if(this.forgetPasswordFormGrp.invalid) {
      return;
    }
   // console.log(this.forgetPasswordFormGrp.value);
    this.authService.forgetPassword(this.forgetPasswordFormGrp.value.Username);
  }

  onReset() {
    console.log(this.forgetPasswordFormGrp);
  }

}

