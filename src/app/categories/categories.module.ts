import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { ComponentsModule } from '../components/components.module';

import { CategoriesPage } from './categories.page';

const categoriesRoutes: Routes = [
  {
    path: '',
    component: CategoriesPage
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    // RouterModule.forChild([{ path: '', component: HomePage }])
    RouterModule.forChild(categoriesRoutes),
    ComponentsModule
  ],
  declarations: [CategoriesPage]
})
export class CategoriesPageModule {}
