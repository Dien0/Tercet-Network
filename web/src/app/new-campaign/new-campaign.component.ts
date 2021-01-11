import { Component, OnInit } from '@angular/core';
import { Campaign, Game, AuthenticationService } from '../authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.scss']
})
export class NewCampaignComponent implements OnInit {

  campaign: Campaign = {
    game: '',
    reward: 1,
    media: '',
    budget: 100,
    daily_budget: 10,
    status: 'active'
  };
  campaignFormGroup: FormGroup;
  games: Game;
  constructor(private auth: AuthenticationService, private router: Router, private route: ActivatedRoute) { }


  ngOnInit() {
    this.auth.getGameList().subscribe(res => {
      this.games = res.data;
    });

    this.campaignFormGroup = new FormGroup({
      game: new FormControl(this.campaign.game, [
        Validators.required,
        Validators.minLength(4)
      ]),
      status: new FormControl(this.campaign.status, [
        Validators.required,
        Validators.minLength(4)
      ]),
      media: new FormControl(this.campaign.media, [
        Validators.required,
        Validators.minLength(5)
      ]),
      campaign_id: new FormControl(this.campaign.campaign_id, [
        Validators.minLength(5)
      ]),
      budget: new FormControl(this.campaign.budget, [
        Validators.required
      ]),
      daily_budget: new FormControl(this.campaign.daily_budget, [
        Validators.required
      ]),
      reward: new FormControl(this.campaign.reward, [
        Validators.required,
        Validators.minLength(5)
      ])
    });
  }
  registerCampaign() {

    if (!this.campaignFormGroup.valid) { return false; }
    this.campaign.game = this.campaignFormGroup.get('game').value;
    this.campaign.media = this.campaignFormGroup.get('media').value;
    this.campaign.budget = this.campaignFormGroup.get('budget').value;
    this.campaign.daily_budget = this.campaignFormGroup.get('daily_budget').value;
    this.campaign.status = this.campaignFormGroup.get('status').value;

    this.auth.registerCampaign(this.campaign).subscribe((resp) => {
   this.router.navigateByUrl('/campaigns');
    }, (err) => {
      console.error(err);
    });
  }
}
