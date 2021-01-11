import { Component, OnInit } from '@angular/core';
import { AuthenticationService, PlayerDetails, SearchPayload } from '../authentication.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss']
})
export class RewardsComponent implements OnInit {
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
    this.route.params.subscribe(params => {
      if (params.list) {
        this.searchGo(params.list);
      //  this.auth.makeDatatable();
      }
    });
  }
  search() {
    this.route.params.subscribe(params => {
      if (params.list) {
        this.searchGo(params.list);
      }
    });
  }
  searchGo(status: string) {
    this.filter.from = this.gForm.get('from').value;
    this.filter.to = this.gForm.get('to').value;
    this.auth.getRewardsByStatus(status, this.filter).subscribe(res => {
      this.rewards = res.data;
      this.auth.loadDatatable(res.data);
    });
  }
  userType() {
    return this.auth.getUserType();
  }

}
