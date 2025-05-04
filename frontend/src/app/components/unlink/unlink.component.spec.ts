import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlinkComponent } from './unlink.component';

describe('UnlinkComponent', () => {
  let component: UnlinkComponent;
  let fixture: ComponentFixture<UnlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnlinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
