import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KyfProfileComponent } from './kyf-profile.component';

describe('KyfProfileComponent', () => {
  let component: KyfProfileComponent;
  let fixture: ComponentFixture<KyfProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KyfProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KyfProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
