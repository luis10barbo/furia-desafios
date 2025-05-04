import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KyfComponent } from './kyf-home.component';

describe('KyfComponent', () => {
  let component: KyfComponent;
  let fixture: ComponentFixture<KyfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KyfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KyfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
