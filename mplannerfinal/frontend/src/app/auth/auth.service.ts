import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData, UserData } from './auth-data.model';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private currUserSubj: BehaviorSubject<AuthData>;
  public currUser: Observable<AuthData>;
  private ifLoggedIn = false;
  private errormsg = '';
  // store boolean yes or no for if the user is authenticated or not rather than the token
  private authStatusListener = new Subject<boolean>();
  private token: string;
  private users: AuthData[] = [];
  private usersUpdated = new Subject<{ users: AuthData[]; userCount: number }>();
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.currUserSubj = new BehaviorSubject<AuthData>(JSON.parse(localStorage.getItem('currentUser')));
    this.currUser = this.currUserSubj.asObservable();
  }

  public get currentUserValue(): AuthData {
    return this.currUserSubj.value;
  }

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
  getLoginStatus() {
    return this.authStatusListener.asObservable();
  }

  getAuthData() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("currentUser");
    return {
      token: token,
      user: user
    }

  }

  createNewUser(fname: string, lname: string, email: string, countrycode: string, phone: string, username: string, password: string) {
    const authData: AuthData = {
      id: '', fname: fname,
      lname: lname,
      email: email,
      countrycode: countrycode,
      phone: phone,
      username: username,
      password: password
    };
    console.log(authData);
    //post request to signup user
    return this.http.post('http://13.233.94.60:3000/api/user/signup', authData);

  }

  getUsers(usersPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    return this.http.get<{ message: string; users: any; maxUsers: number }>
      ('http://13.233.94.60:3000/api/user/allUsers')
      .pipe(
        map(userData => {
          return {
            users: userData.users.map(user => {
              return {
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                countrycode: user.countrycode,
                phone: user.phone,
                id: user._id,
                username: user.username
              };
            }),
            maxUsers: userData.maxUsers
          };

        })
      ).subscribe(transformedUserData => {
        this.users = transformedUserData.users;
        this.usersUpdated.next({
          users: [...this.users],
          userCount: transformedUserData.maxUsers
        });
      });;
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  loginUser(username: string, password: string) {
    const authData: UserData = { username: username, password: password };

    // login user and accept token as string type
    this.http.post<any>('http://13.233.94.60:3000/api/user/login', authData)
      .subscribe(response => {
        // save the token received for future references
        const token = response.token;
        this.token = token;
        this.ifLoggedIn = true;
        if (response && response.token) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', JSON.stringify(response.token));
          this.toastr.success('Logged in as ' + response.role);
          this.currUserSubj.next(response.user);
        }
        if (response.role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/uplanner/' + response.user._id]);
        }

      }, error=> {
        this.errormsg = 'Invalid Username and password';
        console.log(this.errormsg);
        this.toastr.error('Invalid Username or Password');
        //this.toastr.success('Hello world!', 'Toastr fun!');
      });
  }

  // calling forgetPassword API
  forgetPassword(username) {
    // login user and accept token as string type
    this.toastr.info('We are sending you reset password email sortly..');
    this.http.post<any>('http://13.233.94.60:3000/forget-password', { username: username })
      .subscribe(response => {
        this.toastr.success('Sent reset password email..');

          this.router.navigate(['/login']);
      });
  }

  // calling resetPassword API
  resetPassword(params: any): Observable<any> {
    return this.http.post('http://13.233.94.60:3000/reset-password', params);
  }


  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    this.ifLoggedIn = true;
    this.authStatusListener.next(true);
  }

  logout() {
    console.log('logout');
    this.token = null;
    this.ifLoggedIn = false;
    this.authStatusListener.next(false);
    localStorage.removeItem('currentUser');
    //this.router.navigateByUrl('/login');
    window.location.href = './login';
  }
}
