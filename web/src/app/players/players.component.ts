import { Component, OnInit } from '@angular/core';
import { AuthenticationService, PlayerDetails } from '../authentication.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {

  constructor(private auth: AuthenticationService) { }
players: PlayerDetails;
  ngOnInit() {
    this.auth.getPlayerList().subscribe(res => {
      this.players = res.data;
      this.auth.makeDatatable();
    });
  }

}
