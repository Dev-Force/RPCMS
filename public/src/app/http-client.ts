import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';


@Injectable()
export class HttpClient {

  constructor(private http: Http, private authService: AuthService, private router: Router) { }

  notAuthorizedHandler(observable: Observable<any>) {
    return observable.catch(err => {
        if(err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/auth']);
        }
        return Observable.throw(true);
      });
  }

  appendToken(headers: Headers) {
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('access-token')); 
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
    return this.notAuthorizedHandler(this.http.get(url, requestOptions));
  }

  post(url, data, requestOptions = new RequestOptions()) {
    let headers = new Headers();
    this.setParams(headers, requestOptions);
    return this.notAuthorizedHandler(this.http.post(url, data, requestOptions));
  }

  delete(url, requestOptions = new RequestOptions() ) {
    let headers = new Headers();
    this.setParams(headers, requestOptions);
    return this.notAuthorizedHandler(this.http.delete(url, requestOptions));
  }

  put(url, data, requestOptions = new RequestOptions()) {
    let headers = new Headers();
    this.setParams(headers, requestOptions);
    return this.notAuthorizedHandler(this.http.put(url, data, requestOptions));
  }

}
