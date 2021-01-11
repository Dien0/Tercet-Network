import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SearchPayload, AuthenticationService, Game } from '../authentication.service';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-rewards',
  templateUrl: './game-rewards.component.html',
  styleUrls: ['./game-rewards.component.scss']
})
export class GameRewardsComponent implements OnInit, AfterViewInit {
  filter: SearchPayload = {
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  };
  gForm = this.fb.group({
    from: new FormControl(this.filter.from, [
      Validators.required
    ]),
    to: new FormControl(this.filter.to, [
      Validators.required
    ])
  });

  constructor(private fb: FormBuilder, private auth: AuthenticationService, private router: Router) { }
  games: Game;
  ngOnInit() {
    this.search();
  }
  userType() {
    return this.auth.getUserType();
  }
  search() {
    this.filter.from = this.gForm.get('from').value;
    this.filter.to = this.gForm.get('to').value;
    this.auth.getGameStat(this.filter).subscribe(res => {
      this.games = res.data;
    });
  }

  ngAfterViewInit() {
    this.auth.makeDatatable();
  }


}

