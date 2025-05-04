import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedditCallbackComponent } from './reddit-callback.component';

describe('RedditCallbackComponent', () => {
  let component: RedditCallbackComponent;
  let fixture: ComponentFixture<RedditCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedditCallbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedditCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
