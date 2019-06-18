import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
@Injectable({ providedIn: 'root' })

export class UserService {
  getUsers() {
    //return this.http.get('http://13.233.94.60:3000/api/event/'+id);
    return [];
}

}
