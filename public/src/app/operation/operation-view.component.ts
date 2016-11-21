import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { OperationService } from './operation.service';
import { AuthService } from '../auth/auth.service';
import { Operation } from './operation';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-operation-view',
  templateUrl: './operation-view.component.html',
  styleUrls: ['./operation.component.scss']
})
export class OperationViewComponent implements OnInit {
 
  public operation: Operation = new Operation();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private operationService: OperationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.operationService.getOperation(this.route.snapshot.params['id'])
      .map(response => response.json())
      .subscribe(response => {
        this.operation = response as Operation;
      });
  }

}
