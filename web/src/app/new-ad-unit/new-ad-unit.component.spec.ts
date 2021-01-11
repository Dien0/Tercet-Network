import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAdUnitComponent } from './new-ad-unit.component';

describe('NewAdUnitComponent', () => {
  let component: NewAdUnitComponent;
  let fixture: ComponentFixture<NewAdUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAdUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAdUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
