import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptors implements HttpInterceptor{

  constructor(private authService: AuthService) {}


  // creating interceptor middleware for outgoing requests
  intercept(req: HttpRequest<any>, next: HttpHandler) {
        // manipulating incoming request to add our token as authorization header
       // retrieve token from the service
        const authToken = this.authService.getToken();
        // clone request before manipulating to avoid clashing issue
        const authRequest = req.clone({
        // create a request to hold the authorization token in the Authorization header
            headers: req.headers.set('Authorization', 'Bearer ' + authToken)
        });

    // continue the request to forward to the authRequest
    return next.handle(authRequest);
  }
}
