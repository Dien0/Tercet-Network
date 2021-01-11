import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit {

  constructor(private auth: AuthenticationService) { }

  ngAfterViewInit() {
    this.auth.makeSidebar();
  }

  userType() {
    return this.auth.getUserType();
  }

  logout() {
    this.auth.logout();
  }

}
