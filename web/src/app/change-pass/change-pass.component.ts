import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService, ChangePassword } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent implements OnInit {
  changePassword: ChangePassword = {
    oldPassword: '',
     newPassword: ''
   };
  constructor(private fb: FormBuilder, private auth: AuthenticationService,
              private router: Router) {}

cpForm = this.fb.group ({
  oldPassword: [null, Validators.required],
  newPassword: [null, Validators.required],
  confirmPass: [null]
}, { validator: this.checkPasswords});

  checkPasswords(group: FormGroup) {  // here we have the 'passwords' group
  const pass = group.controls.newPassword.value;
  const confirmPass = group.controls.confirmPass.value;
  return pass === confirmPass ? null : { notSame: true };
}

changePass() {
  if (!this.cpForm.valid) { return false; }
  this.changePassword.newPassword = this.cpForm.get('newPassword').value;
  this.changePassword.oldPassword = this.cpForm.get('oldPassword').value;
  this.auth.changepass(this.changePassword).subscribe((resp) => {
    this.router.navigateByUrl('/profile');
  }, (err) => {
    console.error(err);
  });
}

  ngOnInit() {
  }

}
