import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdUnit, AuthenticationService, Mediator } from '../authentication.service';
@Component({
  selector: 'app-new-ad-unit',
  templateUrl: './new-ad-unit.component.html',
  styleUrls: ['./new-ad-unit.component.scss']
})
export class NewAdUnitComponent implements OnInit {
adUnit: AdUnit = {
  mediator_id: '',
  type: '',
  reward: 1
};

adUnitForm: FormGroup;
  mediators: Mediator[];
  constructor(private router: Router, private auth: AuthenticationService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.auth.getMediatorList().subscribe(res => {
      this.mediators = res.data;
    });
    this.route.params.subscribe(params => {
      if (params.aid) {
        this.auth.getAdunit(params.aid).subscribe(unit => {
          this.adUnit = unit.data;
       //   this.adUnit._id = params.aid;
          this.initForm();
        });
      }

    });
    this.initForm();
  }

  initForm() {
    this.adUnitForm = new FormGroup({
      mediator_id: new FormControl(this.adUnit.mediator_id, [
        Validators.required
      ]),
      type: new FormControl(this.adUnit.type, [
        Validators.required
      ]),
      unit: new FormControl(this.adUnit.unit, [
        Validators.required
      ]),
      reward: new FormControl(this.adUnit.reward, [

      ])
    });
  }
  registerAdUnit() {
    if (!this.adUnitForm.valid) { return false; }
    this.adUnit.mediator_id = this.adUnitForm.get('mediator_id').value;
    this.adUnit.unit = this.adUnitForm.get('unit').value;
    this.adUnit.reward = this.adUnitForm.get('reward').value;
    this.adUnit.type = this.adUnitForm.get('type').value;

    this.auth.registerAdUnit(this.adUnit).subscribe((resp) => {
     this.router.navigateByUrl('/adUnits');
    }, (err) => {
      console.error(err);
    });
  }

}
