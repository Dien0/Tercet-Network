import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthenticationService, Game} from '../authentication.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit, AfterViewInit {
  constructor(private auth: AuthenticationService, private router: Router) { }
  games: Game;
  ngOnInit() {
    this.auth.getGameList().subscribe(res => {
      this.games = res.data;
    });

}
userType() {
  return this.auth.getUserType();
}
  edit(gid: string) {
    this.router.navigateByUrl('/edit-game/' + gid);
  }
  delete(gid: string) {
    this.router.navigateByUrl('/delete-game/' + gid);
  }

  ngAfterViewInit() {
  }

}
