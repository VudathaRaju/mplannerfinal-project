import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UplannerComponent } from './uplanner.component';

describe('UplannerComponent', () => {
  let component: UplannerComponent;
  let fixture: ComponentFixture<UplannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UplannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UplannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
