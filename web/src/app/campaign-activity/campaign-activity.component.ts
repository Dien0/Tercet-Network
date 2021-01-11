import { Component, OnInit } from '@angular/core';
import { SearchPayload, AuthenticationService, PlayerDetails } from '../authentication.service';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-campaign-activity',
  templateUrl: './campaign-activity.component.html',
  styleUrls: ['./campaign-activity.component.scss']
})
export class CampaignActivityComponent implements OnInit {
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
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private auth: AuthenticationService) { }
  rewards: PlayerDetails[];
  ngOnInit() {
    this.search();
  }
  search() {
    this.filter.from = this.gForm.get('from').value;
    this.filter.to = this.gForm.get('to').value;
    this.auth.getCampaignActivity(this.filter).subscribe(res => {
      this.rewards = res.data;
      console.log(res.data);
      this.auth.loadDatatable(res.data);
    });
  }
  userType() {
    return this.auth.getUserType();
  }

}
