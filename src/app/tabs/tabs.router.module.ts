import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TabsPage } from './tabs.page';

import { CategoriesPage } from '../categories/categories.page';

import { FashionListingPage } from '../fashion-listing/fashion-listing.page';
import { FashionListingResolver } from '../fashion-listing/fashion-listing.resolver';

import { TravelListingPage } from '../travel-listing/travel-listing.page';
import { TravelListingResolver } from '../travel-listing/travel-listing.resolver';

import { ProfilePage } from '../profile/profile.page';

import { NotificationsPage } from '../notifications/notifications.page';
import { NotificationsResolver } from '../notifications/notifications.resolver';
import { NotificationsService } from '../notifications/notifications.service';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'categories',
        outlet: 'home',
        component: CategoriesPage
      },
      {
        path: 'fashion',
        outlet: 'home',
        component: FashionListingPage,
        resolve: {
          data: FashionListingResolver
        }
      },
      {
        path: 'travel',
        outlet: 'home',
        component: TravelListingPage,
        resolve: {
          data: TravelListingResolver
        }
      },
      {
        path: 'profile',
        outlet: 'profile',
        component: ProfilePage
      },
      {
        path: 'notifications',
        outlet: 'notifications',
        component: NotificationsPage,
        resolve: {
         data: NotificationsResolver,
       }
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/(home:categories)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), HttpClientModule],
  exports: [RouterModule],
  providers: [
    FashionListingResolver,
    TravelListingResolver,
    NotificationsResolver,
    NotificationsService
  ]
})
export class TabsPageRoutingModule {}
