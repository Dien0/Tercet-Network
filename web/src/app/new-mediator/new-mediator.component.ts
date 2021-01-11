import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Mediator, AuthenticationService, Game } from '../authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-mediator',
  templateUrl: './new-mediator.component.html',
  styleUrls: ['./new-mediator.component.scss']
})
export class NewMediatorComponent implements OnInit {
  mediator: Mediator = {
    id: null,
    game: '',
    mediator: '',
    app_id: '',
    unit: ''
  };
  mediatorFormGroup: FormGroup;
  games: Game;
  constructor(private auth: AuthenticationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.auth.getGameList().subscribe(res => {
      this.games = res.data;
    });

    this.route.params.subscribe(params => {
      if (params.mid) {
        this.auth.getMediation(params.mid).subscribe(mediator => {
          this.mediator = mediator.data;
          this.initForm();
        });
      }

    });
    this.initForm();
  }
  initForm() {

    this.mediatorFormGroup = new FormGroup({
      game: new FormControl(this.mediator.game, [
        Validators.required,
        Validators.minLength(4)
      ]),
      app_id: new FormControl(this.mediator.app_id, [
        Validators.required,
        Validators.minLength(5)
      ]),
      app_secret: new FormControl(this.mediator.app_secret, [
        Validators.minLength(5)
      ]),
      mediator_id: new FormControl(this.mediator.id, [
      ]),
      mediator: new FormControl(this.mediator.mediator, [
        Validators.required,
        Validators.minLength(4)
      ])
    });
  }



  registerMediator() {

    if (!this.mediatorFormGroup.valid) { return false; }
    this.mediator.game = this.mediatorFormGroup.get('game').value;
    this.mediator.mediator = this.mediatorFormGroup.get('mediator').value;
    this.mediator.app_id = this.mediatorFormGroup.get('app_id').value;
    this.mediator.app_secret = this.mediatorFormGroup.get('app_secret').value;

    this.auth.registerMediator(this.mediator).subscribe((resp) => {
      this.router.navigateByUrl('/mediations');
    }, (err) => {
      console.error(err);
    });
  }
}
