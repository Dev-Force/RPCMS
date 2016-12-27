import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';
import { AuthService } from 'auth/auth.service';
import { OperationService } from 'operation/operation.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public users: any = [];
  public checkboxAll: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private operationService: OperationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    let tempUsers = [];
    this.userService.getUsers()
      .map(response => response.json())
      .mergeMap(response => {
        tempUsers = response;
        return this.operationService.getOperations()
          .map(response => response.json())
      })
      .subscribe(operations => {
        this.users = tempUsers.map(user => {
          user.operationNames = operations.filter(op => {
            return user.operations.indexOf(op._id) > -1;
          }).map(op => {
            return op.name;
          });
          return user;
        });
      });
  }

  public checkboxSelect(user) {
    user.selected = (user.selected) ? false : true;
    if(this.users.every(el => {
      if(el.selected === true) return true;
      return false;
    })) this.checkboxAll = true;
    else this.checkboxAll = false;
  }

  public checkboxSelectAll() {
    this.users.forEach(el => {
      el.selected = !this.checkboxAll;
    });
  }

  public navigateToAddUser() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  public deleteUser(user) {
    if(!confirm('Are you sure?')) return;
    this.userService.deleteUser(user)
      .map(response => response.json())
      .subscribe(response => {
        if(response) {
          this.users.splice([this.users.indexOf(user)], 1);
          console.log('User deleted feedback');
        }
      });
  }

  deleteUsers() {
    if(!confirm('Are you sure?')) return;
    this.userService.deleteUsers(
      this.users
        .filter(el => el.selected)
        .map(el => el._id)
    )
      .map(response => response.json())
      .subscribe(response => {
        this.users = this.users.filter(el => {
          return !el.selected;
        });    
      });
  }

}
