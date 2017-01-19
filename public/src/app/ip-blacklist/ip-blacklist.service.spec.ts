/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IPBlacklistService } from './ip-blacklist.service.ts';

describe('Service: IPBlacklist', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IPBlacklistService]
    });
  });

  it('should ...', inject([IPBlacklistService], (service: IPBlacklistService) => {
    expect(service).toBeTruthy();
  }));
});
