import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnoozeConfirmationComponent } from './snooze-confirmation.component';

describe('SnoozeConfirmationComponent', () => {
  let component: SnoozeConfirmationComponent;
  let fixture: ComponentFixture<SnoozeConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnoozeConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnoozeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
