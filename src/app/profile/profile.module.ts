import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProfilePage } from './profile.page';
import { ProfileResolver } from './profile.resolver';
import { ComponentsModule } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    resolve: {
      data: ProfileResolver
    }
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    RouterModule.forChild( routes )
  ],
  declarations: [ProfilePage],
  providers: [
    ProfileResolver
  ]
})
export class ProfilePageModule {}
