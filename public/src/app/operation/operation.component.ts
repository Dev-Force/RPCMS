import { Component, OnInit } from '@angular/core';
import { OperationService } from './operation.service';
import { AuthService } from '../auth/auth.service';
 
@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss']
})
export class OperationComponent implements OnInit {

  public operations:any = [];

  constructor(private operationService:OperationService, private authService: AuthService) { }

  ngOnInit() {
    this.operationService.getOperations()
      .map(response => response.json())
      .toPromise()
      .then(response => {
        this.operations = response;
      })
      // Logs out user if the response returns unauthorized
      .catch(err => { 
        this.authService.logout();
      });
  }

}
