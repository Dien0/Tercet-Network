import { Component, OnInit } from '@angular/core';
import { AuthenticationService, Mediator } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mediators',
  templateUrl: './mediators.component.html',
  styleUrls: ['./mediators.component.scss']
})
export class MediatorsComponent implements OnInit {

  constructor(private auth: AuthenticationService, private router: Router) { }
mediators: Mediator[];
  ngOnInit() {
    this.auth.getMediatorList().subscribe(res => {
      this.mediators = res.data;
      this.auth.makeDatatable();
    });
  }
  edit(mid: string) {
    this.router.navigateByUrl('/edit-mediation/' + mid);
  }
  delete(mid: string) {
    if (confirm('Are you sure to delete ')) {
     this.auth.deleteMediator(mid).subscribe(res => {
      this.router.navigateByUrl('/games');
    });
    }

  }
}
