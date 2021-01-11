import { Component, Inject, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload, TokenResponse } from '../authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  templateUrl: './login.component.html',
  selector: 'app-frm-login-app',
})

export class LoginComponent implements OnInit {

  URL = 'https://gemul.ga/api/auth/google/';
  cb = 'https://gemul.ga/';

 // URL = 'http://localhost:3000/api/auth/google/';
 // cb = 'http://localhost:4200/';

  credentials: TokenPayload = {
    email: '',
    password: ''
  };
  loginForm = this.fb.group({
    email: new FormControl(this.credentials.email, [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl(this.credentials.password, [
      Validators.required,
      Validators.minLength(4)
    ])
  });

  constructor(private fb: FormBuilder, private auth: AuthenticationService,
              private router: Router, private route: ActivatedRoute, @Inject(DOCUMENT) private document: Document) {
    this.cb = window.btoa(this.cb);
  }
  googleAuth(): void {
    this.document.location.href = this.URL + this.cb;
  }
  resetPass() {
    this.router.navigateByUrl('/resetPassword');

  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let data = params.data;
      if (data !== undefined) {
        data = atob(data);
        const parts = data.split('&refresh_token=');
        const token = parts[0].split('token=');
        const tokens: TokenResponse = { token: token[1] };
        this.auth.setToken(tokens);
        window.location.href = '/';
      }
    });
  }
  login() {
    if (!this.loginForm.valid) { return false; }
    this.credentials.email = this.loginForm.get('email').value;
    this.credentials.password = this.loginForm.get('password').value;
    this.auth.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (error) => {

    });
  }
}
