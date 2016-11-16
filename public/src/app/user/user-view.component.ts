import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { OperationService } from '../operation/operation.service';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { Operation } from '../operation/operation';
import { User } from './user';

declare var jQuery: any;

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserViewComponent implements OnInit {
 
  public user: User = new User();

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private userService: UserService, private operationService: OperationService, private authService: AuthService) { }

  ngOnInit() {
    let tempUser = null;
    this.userService.getUser(this.route.snapshot.params['id'])
      .map(response => response.json())
      .toPromise()
      .then(response => {
        tempUser = response;
        return this.operationService.getOperations()
          .map(response => response.json())
          .toPromise();
      })
      .then(operations => {
        tempUser.operationNames = operations.filter(op => {
            return tempUser.operations.indexOf(op._id) > -1;
          }).map(op => {
            return op.name;
          });
        this.user = tempUser;
      })
      // Logs out user if the response returns unauthorized
      .catch(err => { 
        this.authService.logout();
        this.router.navigate(['/auth']);
      });
  }

  backButton() {
    this.location.back();
  }

}
