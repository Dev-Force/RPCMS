import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { OperationService } from './operation.service';
import { AuthService } from '../auth/auth.service';
import { Operation } from './operation';

@Component({
  selector: 'app-operation-view',
  templateUrl: './operation-view.component.html',
  styleUrls: ['./operation.component.scss']
})
export class OperationViewComponent implements OnInit {
 
  public operation: Operation = new Operation();

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private operationService: OperationService, private authService: AuthService) { }

  ngOnInit() {
    this.operationService.getOperation(this.route.snapshot.params['id'])
      .map(response => response.json())
      .toPromise()
      .then(response => {
        this.operation = response;
      })
      // Logs out user if the response returns unauthorized
      .catch(err => {
        this.authService.logout();
        this.router.navigate(['/auth']);
      })
  }

  backButton() {
    this.location.back();
  }

}
