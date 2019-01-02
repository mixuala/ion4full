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
        children:[{
          path: '',
          loadChildren: '../categories/categories.module#CategoriesPageModule'
        }]
      },
      {
        path: 'fashion',
        outlet: 'home',
        children:[{
          path: '',
          loadChildren: '../fashion-listing/fashion-listing.module#FashionListingPageModule'
        }],
        resolve: {
          data: FashionListingResolver
        }
      },
      {
        path: 'travel',
        outlet: 'home',
        children:[{
          path: '',
          loadChildren: '../travel-listing/travel-listing.module#TravelListingPageModule'
        }],
        resolve: {
          data: TravelListingResolver
        }
      },
      {
        path: 'profile',
        outlet: 'profile',
        children:[{
          path: '',
          loadChildren: '../profile/profile.module#ProfilePageModule'
        }]
      },
      {
        path: 'notifications',
        outlet: 'notifications',
        children:[{
          path: '',
          loadChildren: '../notifications/notifications.module#NotificationsPageModule'
        }],
        resolve: {
         data: NotificationsResolver,
       }
      }
    ]
  },
  {
    path: '',
    // redirectTo: '/tabs/(home:categories)',
    redirectTo: '/tabs/categories',
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
