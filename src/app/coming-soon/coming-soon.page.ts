import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from '../components/components.module';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.page.html',
  styleUrls: ['./coming-soon.page.scss']
})
export class ComingSoonPage implements OnInit {

  constructor(public menu: MenuController) { }

  ngOnInit() {
    this.menu.enable(false);
  }
}
