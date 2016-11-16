import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { OperationService } from './operation.service';
import { AuthService } from '../auth/auth.service';
import { Operation } from './operation';

declare var jQuery: any;

@Component({
  selector: 'app-operation-add',
  templateUrl: './operation-add.component.html',
  styleUrls: ['./operation.component.scss']
})
export class OperationAddComponent implements OnInit {
 
  public operation: Operation = new Operation();
  public success: boolean = false;
  public error: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private operationService: OperationService, private authService: AuthService) { }

  ngOnInit() {
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
    this.operationService.addOperation(this.operation)
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
