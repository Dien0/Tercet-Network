import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRewardsComponent } from './game-rewards.component';

describe('GameRewardsComponent', () => {
  let component: GameRewardsComponent;
  let fixture: ComponentFixture<GameRewardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameRewardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
