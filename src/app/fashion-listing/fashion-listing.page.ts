import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { delay } from 'rxjs/operators';

import { FashionListingModel } from './fashion-listing.model';

@Component({
  selector: 'app-fashion-listing',
  templateUrl: './fashion-listing.page.html',
  styleUrls: ['./fashion-listing.page.scss'],
})
export class FashionListingPage implements OnInit {
  listing: FashionListingModel;

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    if (this.route && this.route.data) {
      this.route.data.subscribe(routeData => {
        const data = routeData['data'];
        console.log('data - FashionListingPage - ngOnInit()', data);

        if (data) {
          data.subscribe((observableData: FashionListingModel) => {
            if (observableData && observableData.items) {
              this.listing = observableData;
            }

            console.log('observableData - FashionListingPage - ngOnInit()', observableData);
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
