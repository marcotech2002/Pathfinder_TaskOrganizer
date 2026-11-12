/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AddSignalService } from './add-signal.service';

describe('Service: AddSignal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddSignalService]
    });
  });

  it('should ...', inject([AddSignalService], (service: AddSignalService) => {
    expect(service).toBeTruthy();
  }));
});
