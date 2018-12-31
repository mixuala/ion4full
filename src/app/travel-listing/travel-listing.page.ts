import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { delay } from 'rxjs/operators';

import { TravelListingModel } from './travel-listing.model';

@Component({
  selector: 'app-travel-listing',
  templateUrl: './travel-listing.page.html',
  styleUrls: ['./travel-listing.page.scss'],
})
export class TravelListingPage implements OnInit {
  listing: TravelListingModel;

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    if (this.route && this.route.data) {
      this.route.data.subscribe(routeData => {
        const data = routeData['data'];
        console.log('data - TravelListingPage - ngOnInit()', data);

        if (data) {
          data.subscribe((observableData: TravelListingModel) => {
            if (observableData && observableData.items) {
              this.listing = observableData;
            }

            console.log('observableData - TravelListingPage - ngOnInit()', observableData);
          });
        } else {
          alert('No route data 2');
        }
      });
    } else {
      alert('No route data');
    }
  }
}
