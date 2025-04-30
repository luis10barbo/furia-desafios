import { TestBed } from '@angular/core/testing';
import { KyfService } from './kyf.service';


describe('KyfService', () => {
  let service: KyfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KyfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
