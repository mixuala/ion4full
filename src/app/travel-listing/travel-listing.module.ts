import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../components/components.module';

import { TravelListingPage } from './travel-listing.page';
import { TravelListingResolver } from './travel-listing.resolver';
import { TravelService } from './travel.service';

const routes: Routes = [
  {
    path: '',
    component: TravelListingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    HttpClientModule
  ],
  declarations: [TravelListingPage],
  providers: [
    TravelListingResolver,
    TravelService
  ]
})
export class TravelListingPageModule {}
