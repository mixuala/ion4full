import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, MenuController } from '@ionic/angular';

import { AuthService } from '../services/auth.service';
import { TermsOfServicePage } from '../terms-of-service/terms-of-service.page';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';
import { PasswordValidator, PhoneValidator, UsernameValidator,  } from './signup.validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  validation_messages = {
    'username': [
      // unused
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Username must be at least 5 characters long' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters' },
      { type: 'validUsername', message: 'Your username has already been taken' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Please enter a valid email.' },
      { type: 'email', message: 'Please enter a valid email.' },
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'areEqual', message: 'Passwords do not match' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 6 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions' }
    ]
  }

  constructor(
    private authService: AuthService,
    public router: Router,
    public modalController: ModalController,
    public menu: MenuController
  ) {
  }

  ngOnInit() {
    this.menu.enable(false);
    this.signupForm = new FormGroup({
      // 'username': new FormControl('', Validators.compose([
      //   UsernameValidator.validUsername,
      //   Validators.maxLength(25),
      //   Validators.minLength(5),
      //   Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
      //   Validators.required
      // ])),
      'email': new FormControl('test@test.com', [
        Validators.required,
        // Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        Validators.email,
      ]),
      'password': new FormControl('', [
        Validators.required, 
        Validators.minLength(6),
      ]),
      'confirm_password': new FormControl('', [
        Validators.required,
      ])
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup, ['password', 'confirm_password']);
    });
  }


  async showTermsModal() {
   const modal = await this.modalController.create({
     component: TermsOfServicePage
   });
   return await modal.present();
 }

  async showPrivacyModal() {
   const modal = await this.modalController.create({
     component: PrivacyPolicyPage
   });
   return await modal.present();
 }

  doSignup(): void {
    this.errorMessage = null;
    const value = this.signupForm.value;
    this.authService.doRegister(value)
    .then(res => {
      console.log(res);
      this.errorMessage = "";
      this.successMessage = "Your account has been created.";
      // redirect after timeout
      setTimeout( ()=>this.router.navigate(['app/tabs/categories']), 1000);
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
      this.successMessage = "";
    })
    
  }

  doFacebookLogin(): void {
    console.log('facebook login');
    this.router.navigate(['app/tabs/categories']);
  }
  doGoogleLogin(): void {
    console.log('google login');
    this.router.navigate(['app/tabs/categories']);
  }
  doTwitterLogin(): void {
    console.log('twitter login');
    this.router.navigate(['app/tabs/categories']);
  }

}
