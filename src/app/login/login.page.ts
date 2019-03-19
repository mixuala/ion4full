import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' },
      { type: 'email', message: 'Please enter a valid email.' },
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ]
  };

  constructor(
    private authService: AuthService,
    public router: Router,
    public menu: MenuController
  ) {
  }

  ngOnInit() {
    this.menu.enable(false);
    this.loginForm = new FormGroup({
      'email': new FormControl('test@test.com', [
        Validators.required,
        // Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        Validators.email,,
      ]),
      'password': new FormControl('', [
        Validators.required, 
      ])
    });
  }

  doLogin(): void {
    this.errorMessage = null;
    const value = this.loginForm.value;
    this.authService.doLogin(value)
    .then(res => {
      // this.router.navigate(['app/tabs/', { outlets: {home: [ 'categories' ]} }]);
      console.log("doLogin", res)
      this.router.navigate(['app/tabs/categories']);
    }, err => {
      this.errorMessage = err.message;
      console.log(err)
    })
  }

  goToForgotPassword(): void {
    console.log('redirect to forgot-password page');
  }

  doFacebookLogin(): void {
    console.log('facebook login');
    // this.router.navigate(['app/tabs/', { outlets: {home: [ 'categories' ]} }]);
    this.router.navigate(['app/tabs/categories']);
  }
  doGoogleLogin(): void {
    console.log('google login');
    // this.router.navigate(['app/tabs/', { outlets: {home: [ 'categories' ]} }]);
    this.router.navigate(['app/tabs/categories']);
  }
  doTwitterLogin(): void {
    console.log('twitter login');
    // this.router.navigate(['app/tabs/', { outlets: {home: [ 'categories' ]} }]);
    this.router.navigate(['app/tabs/categories']);
  }

}
