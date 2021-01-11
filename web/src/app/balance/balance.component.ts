import { Component, OnInit } from '@angular/core';
import { Balance, AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  constructor(private auth: AuthenticationService) { }
 balances: Balance[];
  ngOnInit() {
    this.auth.getPublisherBalance().subscribe(res => {
      this.balances = res.data;
      this.auth.makeDatatable();
    });
  }

}
