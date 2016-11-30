import { Operation } from './../operation/operation';
import { OperationService } from '../operation/operation.service';
import { AuthService } from '../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  public operations: Operation[] = [];
  public 

  constructor(
    private authService: AuthService,
    private operationService: OperationService
  ) { }

  ngOnInit() {
  }

}
