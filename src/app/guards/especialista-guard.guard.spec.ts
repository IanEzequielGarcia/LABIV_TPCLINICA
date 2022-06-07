import { TestBed } from '@angular/core/testing';

import { EspecialistaGuardGuard } from './especialista-guard.guard';

describe('EspecialistaGuardGuard', () => {
  let guard: EspecialistaGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EspecialistaGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
