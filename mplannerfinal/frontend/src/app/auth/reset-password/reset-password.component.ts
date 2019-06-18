import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PasswordValidation } from '../compare-password.directive';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public isValidRegisterSubmitted = null;
  public userConfirmPassword: FormGroup;
  public token: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.userConfirmPassword = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.compose(([Validators.required]))]
    }, { validator: PasswordValidation.MatchPassword }
    );
  }


  ngOnInit() {
    this.activatedRoute.params
      .subscribe((params: any) => {
        console.log('33--token from params--', params.token);
        this.token = params.token;
      });
  }

  onSubmit() {
    this.isValidRegisterSubmitted = false;
    if (this.userConfirmPassword.invalid) {
      return;
    }
    this.resetPassword();
    this.isValidRegisterSubmitted = true;
  }

  get password(): any {
    return this.userConfirmPassword.get('password');
  }

  get confirmPassword(): any {
    return this.userConfirmPassword.get('confirmPassword');
  }

  resetPassword() {
    this.authService.resetPassword({
      'token': this.token,
      'password': this.userConfirmPassword.value.password
    }).subscribe((response) => {
      console.log('64--response--', response);
      this.toastr.success('Password updated sucessfully.');

      this.router.navigate(['/login']);
    }, error => {
      console.log('--error--', error);
    });
  }

}
