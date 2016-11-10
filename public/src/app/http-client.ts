import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

@Injectable()
export class HttpClient {

  constructor(private http: Http) { }

  appendToken(headers: Headers) {
    headers.append('x-access-token', localStorage.getItem('access-token')); 
  }

  setRequestOptions(headers: Headers, requestOptions) {
      requestOptions.headers = headers;
  }

  setParams(headers, requestOptions?) {
      this.appendToken(headers);
      this.setRequestOptions(headers, requestOptions);
  }

  get(url, requestOptions = new RequestOptions()) {
    let headers = new Headers();
    this.setParams(headers, requestOptions);
    return this.http.get(url, requestOptions);
  }

  post(url, data, requestOptions?) {
    let headers = new Headers();
    this.setParams(headers, requestOptions);
    return this.http.post(url, data, requestOptions);
  }

  delete(url, requestOptions?) {
    let headers = new Headers();
    this.setParams(headers, requestOptions);
    return this.http.delete(url, requestOptions);
  }

  put(url, data, requestOptions?) {
    let headers = new Headers();
    this.setParams(headers, requestOptions);
    return this.http.put(url, data, requestOptions);
  }

}
