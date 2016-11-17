import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { OperationService } from '../operation/operation.service';
import { User } from './user';
import 'rxjs/add/operator/map';

declare var jQuery: any;

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserAddComponent implements OnInit {
 
  public availableOperations: any[] = [];
  public user: User = new User();
  public success: boolean = false;
  public error: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private userService: UserService, private operationService: OperationService, private authService: AuthService) { }

  ngOnInit() {
    jQuery('.dropdown').dropdown();
    jQuery('.checkbox').checkbox();
    
    this.operationService.getOperations()
      .map(response => response.json())
      .subscribe(response => {
        this.availableOperations = response;
      }, err => {  // Logs out user if the response returns unauthorized
        this.authService.logout();
        this.router.navigate(['/auth']);
      });
  }

  onSubmit() {
    this.userService.addUser(this.user)
      .map(response => response.json())
      .subscribe(response => {
        if(!response.errors && !response.errmsg) {
          this.error = false; 
          this.success = true;
        }
        else return Promise.reject(true);
      }, err => {
        this.success = false;
        this.error = true;
      });
  }

  backButton() {
    this.location.back();
  }

}
