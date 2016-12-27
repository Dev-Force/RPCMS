import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OperationService } from './operation.service';
 
@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss']
})
export class OperationComponent implements OnInit {

  public operations: any = [];
  public checkboxAll: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private operationService: OperationService
  ) { }

  ngOnInit() {
    this.operationService.getAuthorizedCRUDOperations()
      .map(response => response.json())
      .subscribe(response => {
        this.operations = response;
      });
  }

  public checkboxSelect(operation) {
    operation.selected = (operation.selected) ? false : true;
    if(this.operations.every(el => {
      if(el.selected === true) return true;
      return false;
    })) this.checkboxAll = true;
    else this.checkboxAll = false;
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
    this.operationService.deleteOperation(operation)
      .subscribe(response => {
        this.operations.splice([this.operations.indexOf(operation)], 1);
      });
  }

  public deleteOperations() {
    if(!confirm('Are you sure?')) return;
    this.operationService.deleteOperations(
      this.operations
      .filter(el => el.selected)
    ).map(response => response.json())
    .subscribe(response => {
      this.operations = this.operations.filter(el => {
        return !el.selected;
      });
    });
  }
  

}
