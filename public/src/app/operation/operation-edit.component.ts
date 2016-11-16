import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { OperationService } from './operation.service';
import { AuthService } from '../auth/auth.service';
import { Operation } from './operation';

declare var jQuery: any;

@Component({
  selector: 'app-operation-edit',
  templateUrl: './operation-edit.component.html',
  styleUrls: ['./operation.component.scss']
})
export class OperationEditComponent implements OnInit {
 
  public operation: Operation = new Operation();
  public success: boolean = false;
  public error: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private operationService: OperationService, private authService: AuthService) { }

  ngOnInit() {
    this.operationService.getOperation(this.route.snapshot.params['id'])
      .map(response => response.json())
      .toPromise()
      .then(response => {
        let op = new Operation();
        op._id = response._id;
        op.name = response.name;
        op.namedParams = response.namedParams;
        op.positionalNumOfParams = response.positionalNumOfParams;

        if(op.namedParams.length === 0) op.namedParams.push('');

        this.operation = op;
      })// Logs out user if the response returns unauthorized
      .catch(err => { 
        this.authService.logout();
        this.router.navigate(['/auth']);
      });
  }

  addNamedParam() {
    this.operation.namedParams.push('');
  }

  removeNamedParam(index) {
    this.operation.namedParams.splice(index, 1);
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  onSubmit() {
    this.operationService.editOperation(this.operation)
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
