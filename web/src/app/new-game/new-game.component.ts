import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, Game } from '../authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit {

  game: Game = {
    id: null,
    name: '',
    mode: 'test',
    bundle_id: '',
    platform: ''
  };
  gameForm: FormGroup;
  constructor(private auth: AuthenticationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.gid) {
        this.auth.getGame(params.gid).subscribe(game => {
          this.game = game.data;
          this.initForm();
        });
      }

    });
    this.initForm();
  }

 initForm() {
  this.gameForm = new FormGroup({
    name: new FormControl(this.game.name, [
      Validators.required,
      Validators.minLength(4)
    ]),
    id: new FormControl(this.game.id, [
    ]),
    mode: new FormControl(this.game.mode, [
      Validators.required,
      Validators.minLength(4)
    ]),
    platform: new FormControl(this.game.platform, [
      Validators.required,
      Validators.minLength(6)
    ]),
    bundle_id: new FormControl(this.game.bundle_id, [
      Validators.required,
      Validators.minLength(10)
    ])
  });
 }

  registerGame() {
    if (!this.gameForm.valid) { return false; }
    this.game.name = this.gameForm.get('name').value;
    this.game.bundle_id = this.gameForm.get('bundle_id').value;
    this.game.mode = this.gameForm.get('mode').value;
    this.game.platform = this.gameForm.get('platform').value;
    this.auth.registerGame(this.game).subscribe((resp) => {
      this.router.navigateByUrl('/games');
    }, (err) => {
      console.log(err);
    });
  }
}
