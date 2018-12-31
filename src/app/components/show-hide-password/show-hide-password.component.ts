import { Component, ContentChild } from '@angular/core';

import { Input } from '@ionic/angular';

@Component({
  selector: 'app-show-hide-password',
  templateUrl: './show-hide-password.component.html',
  styleUrls: [
    './show-hide-password.component.scss'
  ]
  // host: {
  //   'class': 'show-hide-password'
  // }
})
export class ShowHidePasswordComponent {
  show = false;

  @ContentChild(Input) input: Input;

  constructor() {}

  toggleShow() {
    this.show = !this.show;
    if (this.show) {
      this.input.type = 'text';
    } else {
      this.input.type = 'password';
    }
  }
}
