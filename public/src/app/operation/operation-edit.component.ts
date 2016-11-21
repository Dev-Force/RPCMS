import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { OperationService } from './operation.service';
import { AuthService } from '../auth/auth.service';
import { Operation } from './operation';
import 'rxjs/add/operator/map';

declare var jQuery: any;

@Component({
  selector: 'app-operation-edit',
  templateUrl: './operation-edit.component.html',
  styleUrls: ['./operation.component.scss']
})
export class OperationEditComponent implements OnInit {
 
  public operation: Operation = new Operation();
  public tokenLocations: string[] = ['None', 'Headers', 'Parameters'];
  public requestMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE'];
  public radioTokenLocation: any = { value: 'None' };
  public radioRequestMethod: any = { value: 'GET' };
  public success: boolean = false;
  public error: boolean = false;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private location: Location, 
    private operationService: OperationService, 
    private authService: AuthService
  ) { }

  ngOnInit() {
    jQuery('.ui.accordion').accordion();
    jQuery('.ui.checkbox').checkbox();
    this.operationService.getOperation(this.route.snapshot.params['id'])
      .map(response => response.json())
      .subscribe(response => {
        this.operation = response as Operation;

        if(this.operation.tokenInHeaders) this.radioTokenLocation.value = 'Headers';
        else if(this.operation.tokenInParams) this.radioTokenLocation.value = 'Parameters';

        this.radioRequestMethod.value = this.operation.requestMethod;

        if(this.operation.namedParams.length === 0) this.operation.namedParams.push('');
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

}
