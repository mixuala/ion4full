import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '../components/components.module';
import { ComingSoonPage } from './coming-soon.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    RouterModule.forChild([
      {
         path: '',
         component: ComingSoonPage
      }
    ])
  ],
  declarations: [ ComingSoonPage ]
})
export class ComingSoonPageModule {}
