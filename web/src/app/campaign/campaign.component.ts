import { Component, OnInit } from '@angular/core';
import { AuthenticationService, Campaign } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit {

  constructor(private auth: AuthenticationService, private router: Router) { }
campaigns: Campaign[];
  ngOnInit() {
    this.auth.getCampaigns().subscribe(res => {
      this.campaigns = res.data;
      this.auth.makeDatatable();
    });
  }

  edit(cid: string) {
    this.router.navigateByUrl('/edit-campaign/' + cid);
  }
  delete(cid: string) {
    this.router.navigateByUrl('/delete-campaign/' + cid);
  }

}
