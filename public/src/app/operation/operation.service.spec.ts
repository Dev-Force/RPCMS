/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OperationService } from './operation.service';

describe('Service: Operation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OperationService]
    });
  });

  it('should ...', inject([OperationService], (service: OperationService) => {
    expect(service).toBeTruthy();
  }));
});
