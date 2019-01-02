import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    public router: Router,
    public menu: MenuController
  ) {
    this.loginForm = new FormGroup({
      'email': new FormControl('test@test.com', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]),
      'password': new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.menu.enable(false);
  }

  doLogin(): void {
    console.log('do Log In');
    // this.router.navigate(['app/tabs/', { outlets: {home: [ 'categories' ]} }]);
    this.router.navigate(['app/tabs/categories']);
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
