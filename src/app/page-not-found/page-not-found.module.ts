import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '../components/components.module';
import { PageNotFound } from './page-not-found.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    RouterModule.forChild([
      {
         path: '',
         component: PageNotFound
      }
    ])
  ],
  declarations: [PageNotFound]
})
export class PageNotFoundModule {}
