import { Injectable } from '@angular/core';
import { Credentials } from './credentials';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class AuthService {

  private authURL: string = 'http://localhost:3000/api/v1/auth/authentication'
  private loggedIn: boolean = false;

  constructor(private http: Http) {
    this.loggedIn = localStorage.getItem('access-token') ? true : false;
  } 

  public checkAuth(credentials: Credentials): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.authURL, {username: credentials.username, password: credentials.password}, options)
      .map(response => response.json())
      .toPromise()
      .then(response => {
        if(response.success) localStorage.setItem('access-token', response.token);
        this.loggedIn = true;
        return response;
      });
  }

  public isLoggedIn() {
    return this.loggedIn;
  }

  public logout() {
    localStorage.removeItem('access-token');
    this.loggedIn = false;
  }

}
