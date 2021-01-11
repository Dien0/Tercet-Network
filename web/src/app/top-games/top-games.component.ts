import { Component, OnInit } from '@angular/core';
import { Game, AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-games',
  templateUrl: './top-games.component.html',
  styleUrls: ['./top-games.component.scss']
})
export class TopGamesComponent implements OnInit {

  constructor(private auth: AuthenticationService, private router: Router) { }
  games: Game;
  ngOnInit() {
    this.auth.getTopGames().subscribe(res => {
      this.games = res.data;
    });
  }

}
