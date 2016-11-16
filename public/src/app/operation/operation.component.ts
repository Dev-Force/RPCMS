import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OperationService } from './operation.service';
import { AuthService } from '../auth/auth.service';
 
@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss']
})
export class OperationComponent implements OnInit {

  public operations: any = [];
  public checkboxAll: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private operationService: OperationService, private authService: AuthService) { }

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
        this.router.navigate(['/auth']);
      });
  }

  public checkboxSelect(operation) {
    operation.selected = (operation.selected) ? false : true;
  }

  public checkboxSelectAll() {
    this.operations.forEach(el => {
      el.selected = !this.checkboxAll;
    });
  }

  public navigateToAddOperation() {
    this.router.navigate(['add'],  {relativeTo: this.route});
  }

  public deleteOperation(operation) {
    if(!confirm('Are you sure?')) return;
    this.operationService.deleteOperation(operation._id)
      .toPromise()
      .then(response => {
        this.operations.splice([this.operations.indexOf(operation)], 1);
      })
  }

  public deleteOperations() {
    if(!confirm('Are you sure?')) return;
    this.operationService.deleteOperations(
      this.operations
        .filter(el => el.selected)
        .map(el => el._id)
      )
      .map(response => response.json())
      .toPromise()
      .then(response => {
        this.operations = this.operations.filter(el => {
          return !el.selected;
        });
      });
  }
  

}
