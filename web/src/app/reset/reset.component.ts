import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './reset.component.html',
  selector: 'app-frm-admin-login-app',
})
export class ResetComponent {
  resetForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]]
  });
  credentials: TokenPayload = {
    email: '',
    password: '',
    type: ''
  };

  constructor( private fb: FormBuilder, private auth: AuthenticationService, private router: Router) { }

  reset() {
    if (!this.resetForm.valid) { return false; }
    this.credentials.email = this.resetForm.get('email').value;
    this.auth.reset().subscribe(() => {
      }, (error) => {
       // console.log(error);
      });
  }
}
