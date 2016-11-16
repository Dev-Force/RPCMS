import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { OperationService } from '../operation/operation.service';
import { User } from './user';
import { Operation } from '../operation/operation';

declare var jQuery: any;

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserEditComponent implements OnInit {
 
  public user: User = new User();
  public availableOperations: any[] = []
  public success: boolean = false;
  public error: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private userService: UserService, private operationService: OperationService, private authService: AuthService) { }

  ngOnInit() {

    this.operationService.getOperations()
      .map(response => response.json())
      .toPromise()
      .then(response => {
        this.availableOperations = response;
        return this.userService.getUser(this.route.snapshot.params['id'])
          .map(response => response.json())
          .toPromise();
      }).then(response => {
        let user = new User();
        user._id = response._id;
        user.username = response.username;
        user.admin = response.admin;
        user.operations = response.operations;

        this.user = user;

        // Check already selected operations
        jQuery('.dropdown').dropdown('set selected', user.operations);

      })// Logs out user if the response returns unauthorized
      .catch(err => { 
        this.authService.logout();
        this.router.navigate(['/auth']);
      });
    
    jQuery('.checkbox').checkbox();

  }

  onSubmit() {
    this.userService.editUser(this.user)
      .map(response => response.json())
      .toPromise()
      .then(response => {
        if(!response.errors && !response.errmsg) {
          this.error = false; 
          this.success = true;
        }
        else return Promise.reject(true);
      }).catch(err => {
        this.success = false;
        this.error = true;
      });
  }
  
  backButton() {
    this.location.back();
  }

}
