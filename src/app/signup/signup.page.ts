import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, MenuController } from '@ionic/angular';
import { TermsOfServicePage } from '../terms-of-service/terms-of-service.page';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;

  constructor(
    public router: Router,
    public modalController: ModalController,
    public menu: MenuController
  ) {
    this.signupForm = new FormGroup({
      'email': new FormControl('test@test.com', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]),
      'password': new FormControl('', Validators.required),
      'confirm_password': new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.menu.enable(false);
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
    this.router.navigate(['app/tabs/', { outlets: {home: [ 'categories' ]} }]);
  }

  doFacebookLogin(): void {
    console.log('facebook login');
    this.router.navigate(['app/tabs/', { outlets: {home: [ 'categories' ]} }]);
  }
  doGoogleLogin(): void {
    console.log('google login');
    this.router.navigate(['app/tabs/', { outlets: {home: [ 'categories' ]} }]);
  }
  doTwitterLogin(): void {
    console.log('twitter login');
    this.router.navigate(['app/tabs/', { outlets: {home: [ 'categories' ]} }]);
  }

}
