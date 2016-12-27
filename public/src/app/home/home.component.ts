import { Operation } from 'operation/operation';
import { OperationService } from 'operation/operation.service';
import { Component, OnInit } from '@angular/core';


declare var jQuery: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public operations: Operation[] = [];

  constructor(
    private operationService: OperationService
  ) { }

  ngOnInit() {
    jQuery('.ui.accordion')
      .accordion();
    jQuery('.accordion')
      .accordion({
        selector: {
          trigger: '.title'
        }
      });
    this.operationService.getOperations()
      .map(response => response.json())
      .subscribe(response => {
        this.operations = response;
      });
  }

}
