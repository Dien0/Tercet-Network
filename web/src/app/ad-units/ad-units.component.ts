import { Component, OnInit } from '@angular/core';
import { AuthenticationService, AdUnit } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ad-units',
  templateUrl: './ad-units.component.html',
  styleUrls: ['./ad-units.component.scss']
})
export class AdUnitsComponent implements OnInit {
  adUnits: AdUnit[];

  constructor(private router: Router, private auth: AuthenticationService) { }

  ngOnInit() {
    this.auth.getadUnitList().subscribe(res => {
      this.adUnits = res.data;
      this.auth.makeDatatable();
    });
  }

  edit(aid: string) {
    this.router.navigateByUrl('/edit-adUnit/' + aid);
  }
  delete(aid: string) {
    if (confirm('Are you sure to delete ')) {
     this.auth.deleteAdUnit(aid).subscribe(res => {
      this.router.navigateByUrl('/games');
    });
    }

  }

}
