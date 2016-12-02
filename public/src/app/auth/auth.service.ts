import { Injectable } from '@angular/core';
import { Urls } from '../remote-urls';
import { Credentials } from './credentials';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';


@Injectable()
export class AuthService {

  private tokenAuthUrl: string;
  private ipAuthUrl: string;
  private loggedInToken: boolean = false;
  private loggedInIp: boolean = false;
  private admin: boolean = false; 
  public redirectUrl: string;

  constructor(private http: Http) {
    this.ipAuthUrl = Urls.ipAuth;
    this.tokenAuthUrl = Urls.tokenAuth
    this.loggedInToken = localStorage.getItem('access-token') ? true : false;
    this.admin = (localStorage.getItem('admin') === 'true') ? true : false;
    this.checkIpAuth().subscribe(response => {
      if(response.success) this.loggedInIp = true;
    });
  } 

  public checkTokenAuth(credentials: Credentials): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.tokenAuthUrl, {username: credentials.username, password: credentials.password}, options)
      .map(response => response.json())
      .map(response => {
        if(response.success) {
          localStorage.setItem('access-token', response.token);

          // Decode Json Web Token payload
          let admin = JSON.parse(atob(response.token.split(".")[1]))['admin'];
          localStorage.setItem('admin', admin);
          this.admin = admin;

          this.loggedInToken = true;
        }
        return response;
      });
  }

  public checkIpAuth(): Observable<any> {
    return this.http.post(this.ipAuthUrl, {})
      .map(response => response.json())
      .map(response => {
        if(response.success) {
          localStorage.removeItem('admin');
          localStorage.removeItem('access-token');

          localStorage.setItem('admin', 'true');
          this.admin = true;
          this.loggedInIp = true;
        }
        return response;
      }).catch(err => { // Forward error
        return Observable.of(err);
      });
  }

  public isLoggedInToken() {
    return this.loggedInToken;
  }

  public isLoggedInIp() {
    return this.loggedInIp;
  }

  public isLoggedIn() {
    return localStorage.getItem('access-token') || localStorage.getItem('admin') || this.loggedInToken || this.loggedInIp;
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
