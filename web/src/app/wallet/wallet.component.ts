import { Component, OnInit } from '@angular/core';
import { AuthenticationService, Wallet } from '../authentication.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  wallet: Wallet;
  constructor(private auth: AuthenticationService) { }

  refresh() {
    this.auth.walletRefresh().subscribe(resp => {
      console.log(resp);
    }, (err) => {
      console.error(err);
    });
  }

  ngOnInit() {
    this.auth.wallet().subscribe(user => {
      this.wallet = user.data;
    }, (err) => {
      console.error(err);
    });
  }
}
