import { Component, OnInit } from '@angular/core';
import { AuthenticationService, Profile } from '../authentication.service';


@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  details: Profile;

  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
   this.auth.profile().subscribe(user => {
    this.details = user.data;
    }, (err) => {
      console.error(err);
    });
  }
}
