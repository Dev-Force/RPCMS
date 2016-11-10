import { Injectable } from '@angular/core';
import { HttpClient } from '../http-client';
import { Urls } from '../remote-urls';

@Injectable()
export class UserService {

  private usersUrl: string;

  constructor(private http: HttpClient) {
    this.usersUrl = Urls.users;
  }

  public getUsers() {
    return this.http.get(this.usersUrl);
  }

}
