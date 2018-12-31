import { Component, ViewEncapsulation, AfterContentInit, ContentChild, HostBinding } from '@angular/core';

// Lista de los componentes de Ionic: https://github.com/ionic-team/ionic/blob/master/angular/src/directives/proxies.ts
import { Checkbox } from '@ionic/angular';

@Component({
  selector: 'app-custom-checkbox',
  templateUrl: './custom-checkbox.component.html',
  styleUrls: [
    './custom-checkbox.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class CustomCheckboxComponent implements AfterContentInit {
  @ContentChild(Checkbox) checkbox: Checkbox;

  @HostBinding('class.checkbox-checked') isChecked: boolean;

  constructor() {}

  ngAfterContentInit() {
    // ContentChild is set
    this.isChecked = this.checkbox.checked;

    // Subscribe to changes
    this.checkbox.ionChange.subscribe(changes => {
      this.isChecked = changes.detail.checked;
    });
  }
}
