import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KyfVerifyComponent } from './kyf-verify.component';

describe('KyfProfileComponent', () => {
  let component: KyfVerifyComponent;
  let fixture: ComponentFixture<KyfVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KyfVerifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KyfVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
