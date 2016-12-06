import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { OperationService } from './operation.service';
import { AuthService } from '../auth/auth.service';
import { Operation } from './operation';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

declare var jQuery: any;

@Component({
  selector: 'app-operation-add',
  templateUrl: './operation-add.component.html',
  styleUrls: ['./operation.component.scss']
})
export class OperationAddComponent implements OnInit {
 
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
    this.operation.namedParams.push('');
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
    this.operation.requestMethod = this.radioRequestMethod.value;
    this.operation.tokenInParams = this.operation.tokenInHeaders = false;

    switch(this.radioTokenLocation.value) {
      case 'Parameters':
        this.operation.tokenInParams = true;
        break;

      case 'Headers':
        this.operation.tokenInHeaders = true;
    }

    this.operationService.addOperation(this.operation)
      .map(response => response.json())
      .subscribe(response => {
        if(response.errmsg || response.errors) {
          this.error = true;
          this.success = false;
        } else {
          this.error = false;
          this.success = true;
        }
      });
  }

}
