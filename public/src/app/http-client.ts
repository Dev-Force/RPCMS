import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';


@Injectable()
export class HttpClient {

  constructor(private http: Http, private authService: AuthService, private router: Router) { }

  appendToken(headers: Headers) {
    headers.append('x-access-token', localStorage.getItem('access-token')); 
  }

  setRequestOptions(headers: Headers, requestOptions) {
      requestOptions.headers = headers;
  }

  setParams(headers, requestOptions) {
      this.appendToken(headers);
      this.setRequestOptions(headers, requestOptions);
  }

  get(url, requestOptions = new RequestOptions()) {
    let headers = new Headers();
    this.setParams(headers, requestOptions);
    return this.http.get(url, requestOptions)
      .catch(err => {
        this.authService.logout();
        this.router.navigate(['/auth']);
        return Observable.throw(true);
      });
  }

  post(url, data, requestOptions = new RequestOptions()) {
    let headers = new Headers();
    this.setParams(headers, requestOptions);
    return this.http.post(url, data, requestOptions)
      .catch(err => {
        this.authService.logout();
        this.router.navigate(['/auth']);
        return Observable.throw(true);
      });
  }

  delete(url, requestOptions = new RequestOptions() ) {
    let headers = new Headers();
    this.setParams(headers, requestOptions);
    return this.http.delete(url, requestOptions)
      .catch(err => {
        this.authService.logout();
        this.router.navigate(['/auth']);
        return Observable.throw(true);
      });
  }

  put(url, data, requestOptions = new RequestOptions()) {
    let headers = new Headers();
    this.setParams(headers, requestOptions);
    return this.http.put(url, data, requestOptions)
      .catch(err => {
        this.authService.logout();
        this.router.navigate(['/auth']);
        return Observable.throw(true);
      });
  }

}
