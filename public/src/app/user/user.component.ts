import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public users: any = [];

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.userService.getUsers()
      .map(response => response.json())
      .toPromise()
      .then(response => {
        this.users = response;
      })
      // Logs out user if the response returns unauthorized
      .catch(err => { 
        this.authService.logout();
      });
  }

}
