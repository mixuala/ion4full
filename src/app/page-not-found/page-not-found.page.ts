import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from '../components/components.module';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.page.html',
  styleUrls: ['./page-not-found.page.scss']
})
export class PageNotFound implements OnInit {

  constructor(public menu: MenuController) { }

  ngOnInit() {
    this.menu.enable(false);
  }
}
