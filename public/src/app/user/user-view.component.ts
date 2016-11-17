import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { OperationService } from '../operation/operation.service';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { Operation } from '../operation/operation';
import { User } from './user';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

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
      .mergeMap(response => {
        tempUser = response;
        return this.operationService.getOperations()
          .map(response => response.json());
      })
      .subscribe(operations => {
        tempUser.operationNames = operations.filter(op => {
            return tempUser.operations.indexOf(op._id) > -1;
          }).map(op => {
            return op.name;
          });
        this.user = tempUser;
      });
  }

  backButton() {
    this.location.back();
  }

}
