import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMediatorComponent } from './new-mediator.component';

describe('NewMediatorComponent', () => {
  let component: NewMediatorComponent;
  let fixture: ComponentFixture<NewMediatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMediatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMediatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
