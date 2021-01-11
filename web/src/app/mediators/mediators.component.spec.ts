import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediatorsComponent } from './mediators.component';

describe('MediatorsComponent', () => {
  let component: MediatorsComponent;
  let fixture: ComponentFixture<MediatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
