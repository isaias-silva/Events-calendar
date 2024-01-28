import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isValidMailGuard } from './is-valid-mail.guard';

describe('isValidMailGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isValidMailGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
