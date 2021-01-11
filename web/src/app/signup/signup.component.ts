import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder, Validators, FormGroup, NgForm, FormControl, FormGroupDirective } from '@angular/forms';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
    return (invalidCtrl || invalidParent);
  }
}

@Component({
  templateUrl: './signup.component.html',
  selector: 'app-frm-signup-app',
  styleUrls: ['./signup.component.css'],

})


export class SignupComponent {
  constructor(private fb: FormBuilder, private auth: AuthenticationService, private router: Router) {
    this.regFormGroup = this.fb.group ({
      email: [null, [Validators.email, Validators.required]],
      name: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confirmPass: [null]
    }, { validator: this.checkPasswords});

  }
  matcher = new MyErrorStateMatcher();
  hide = true;
  chide = true;

  credentials: TokenPayload = {
    email: '',
    name: '',
    password: ''
  };
  regFormGroup: FormGroup;

  checkPasswords(group: FormGroup) {  // here we have the 'passwords' group
  const pass = group.controls.password.value;
  const confirmPass = group.controls.confirmPass.value;
  return pass === confirmPass ? null : { notSame: true };
}

  signup() {
    if (!this.regFormGroup.valid) { return false; }
    this.credentials.email = this.regFormGroup.get('email').value;
    this.credentials.name = this.regFormGroup.get('name').value;
    this.credentials.password = this.regFormGroup.get('password').value;
    this.auth.signup(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (error) => {
    });
  }
}
