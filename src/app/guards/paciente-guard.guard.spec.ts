import { TestBed } from '@angular/core/testing';

import { PacienteGuardGuard } from './paciente-guard.guard';

describe('PacienteGuardGuard', () => {
  let guard: PacienteGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PacienteGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
