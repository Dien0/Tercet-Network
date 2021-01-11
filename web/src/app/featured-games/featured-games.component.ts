import { Component, OnInit } from '@angular/core';
import { AuthenticationService, Game } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-featured-games',
  templateUrl: './featured-games.component.html',
  styleUrls: ['./featured-games.component.scss']
})
export class FeaturedGamesComponent implements OnInit {

  constructor(private auth: AuthenticationService, private router: Router) { }
  games: Game;
  ngOnInit() {
    this.auth.getFeaturedGame().subscribe(res => {
      this.games = res.data;
    });
  }

}
