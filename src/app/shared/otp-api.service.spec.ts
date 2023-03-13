import { TestBed } from '@angular/core/testing';

import { OtpApiService } from './otp-api.service';

describe('OtpApiService', () => {
  let service: OtpApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtpApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
