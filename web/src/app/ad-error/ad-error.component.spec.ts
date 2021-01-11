import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdErrorComponent } from './ad-error.component';

describe('AdErrorComponent', () => {
  let component: AdErrorComponent;
  let fixture: ComponentFixture<AdErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
