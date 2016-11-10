import { Injectable } from '@angular/core';
import { HttpClient } from '../http-client';
import { Urls } from '../remote-urls';

@Injectable()
export class OperationService {

  private operationsUrl: string;

  constructor(private http: HttpClient) { 
    this.operationsUrl = Urls.operations;
  }

  public getOperations() {
    return this.http.get(this.operationsUrl);
  }

}
