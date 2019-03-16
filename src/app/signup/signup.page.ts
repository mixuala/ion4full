import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, MenuController } from '@ionic/angular';

import { AuthService } from '../services/auth.service';
import { TermsOfServicePage } from '../terms-of-service/terms-of-service.page';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

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
      'email': new FormControl('test@test.com', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]),
      'password': new FormControl('', [
        Validators.required, 
        Validators.minLength(6),
      ]),
      'confirm_password': new FormControl('', [
        Validators.required,
        // TODO: match password
      ])
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
    console.log('do sign up');
    const value = this.signupForm.value;
    if (value.password != value.confirm_password){
      this.errorMessage = "Passwords do not match";
      this.successMessage = "";
      return
    }
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
