import { Injectable } from '@angular/core';
import { HttpClient } from 'utils/http-client';
import { Urls } from 'remote-urls';
import { User } from './user';

@Injectable()
export class UserService {

  private usersUrl: string;

  constructor(private http: HttpClient) {
    this.usersUrl = Urls.users;
  }

  public getUsers() {
    return this.http.get(this.usersUrl);
  }

  public getUser(id) {
    return this.http.get(this.usersUrl + '/' + id);
  }

  public addUser(user: User) {
    return this.http.post(this.usersUrl, user);
  }

  public editUser(user: User) {
    return this.http.put(this.usersUrl + '/' + user._id, user);
  }

  public deleteUser(user) {
    return this.http.delete(this.usersUrl + '/' + user._id);
  }

  public deleteUsers(arrayOfUserIDs) {
    return this.http.post(this.usersUrl + '/destroyMass', arrayOfUserIDs);
  }

}
