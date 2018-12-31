import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-terms-of-service-page',
  templateUrl: 'terms-of-service.page.html',
  styleUrls: ['./terms-of-service.page.scss']
})

export class TermsOfServicePage {

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }
}
