import { Injectable } from '@angular/core';
import { Urls } from '../remote-urls';
import { Credentials } from './credentials';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class AuthService {

  private tokenAuthUrl: string;
  private ipAuthUrl: string;
  private loggedInToken: boolean = false;
  private loggedInIp: boolean = false;
  private admin: boolean = false; 

  constructor(private http: Http) {
    this.ipAuthUrl = Urls.ipAuth;
    this.tokenAuthUrl = Urls.tokenAuth
    this.loggedInToken = localStorage.getItem('access-token') ? true : false;
    this.admin = (localStorage.getItem('admin') === 'true') ? true : false;

    console.log(localStorage.getItem('admin'));
  } 

  public checkTokenAuth(credentials: Credentials): Promise<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.tokenAuthUrl, {username: credentials.username, password: credentials.password}, options)
      .map(response => response.json())
      .toPromise()
      .then(response => {
        if(response.success) {
          localStorage.setItem('access-token', response.token);
          localStorage.setItem('admin', JSON.parse(atob(response.token.split(".")[1]))['admin']);
          this.loggedInToken = true;
        }
        return response;
      });
  }

  public checkIpAuth(): Promise<any> {
    return this.http.post(this.ipAuthUrl, {})
      .map(response => response.json())
      .toPromise()
      .then(response => {
        if(response.success) {
          localStorage.setItem('admin', 'true');
          this.loggedInIp = true;
        }
        return response;
      });
  }

  public isLoggedInToken() {
    return this.loggedInToken;
  }

  public isLoggedInIp() {
    return this.loggedInIp;
  }

  public isLoggedIn() {
    return this.loggedInToken || this.loggedInIp;
  }

  public isAdmin() {
    return this.admin;
  }

  public logout() {
    localStorage.removeItem('admin');
    localStorage.removeItem('access-token');
    this.loggedInToken = false;
    this.loggedInIp = false;
  }

}
