import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';

import { CategoriesPageModule } from '../categories/categories.module';
import { FashionListingPageModule } from '../fashion-listing/fashion-listing.module';
import { TravelListingPageModule } from '../travel-listing/travel-listing.module';

import { ProfilePageModule } from '../profile/profile.module';

import { NotificationsPageModule } from '../notifications/notifications.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    CategoriesPageModule,
    FashionListingPageModule,
    TravelListingPageModule,
    ProfilePageModule,
    NotificationsPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
