import { Http } from '@angular/http';
import { AuthService } from '../auth/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '../http-client';
import { Urls } from '../remote-urls';
import { Operation } from './operation';

@Injectable()
export class OperationService {

  private operationsUrl: string = Urls.operations;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public getOperations() {
    return this.http.get(this.operationsUrl);
  }

  public getAuthorizedCRUDOperations() {
    return this.http.get(this.operationsUrl + '/authorizedCRUD');
  }

  public getOperation(op_id) {
    return this.http.get(this.operationsUrl + '/' + op_id);
  }

  public addOperation(operation: Operation) {
    return this.http.post(this.operationsUrl, operation);
  }
  
  public editOperation(operation: Operation) {
    return this.http.put(this.operationsUrl + '/' + operation._id, operation);
  }

  public deleteOperations(arrayOfOperationIDs: Operation[]) {
    return this.http.post(this.operationsUrl + '/deleteMass', {
      operations: arrayOfOperationIDs
    });
  }

  public deleteOperation(operation: Operation) {
    return this.http.delete(this.operationsUrl + '/' + operation._id);
  }

}
