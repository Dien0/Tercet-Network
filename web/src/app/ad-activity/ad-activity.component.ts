import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthenticationService, Game, SearchPayload } from '../authentication.service';

@Component({
  selector: 'app-ad-activity',
  templateUrl: './ad-activity.component.html',
  styleUrls: ['./ad-activity.component.scss']
})
export class AdActivityComponent implements OnInit {
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
  constructor(private fb: FormBuilder, private auth: AuthenticationService) { }
  games: Game[];

  ngOnInit() {
    this.search();
    this.auth.makeDatatable();
  }

  search() {
    this.filter.from = this.gForm.get('from').value;
    this.filter.to = this.gForm.get('to').value;
    this.auth.getAdsActivity(this.filter).subscribe(res => {
      this.games = res.data;
      this.auth.loadDatatable(res.data);
    });
  }

}
