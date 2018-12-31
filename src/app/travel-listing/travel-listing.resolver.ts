import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';
import { first, delay } from 'rxjs/operators';

import { TravelService } from './travel.service';

@Injectable()
export class TravelListingResolver implements Resolve<any> {

  constructor(
    private travelService: TravelService
  ) {}

  resolve() {
    return new Promise((resolve, reject) => {
      const documentObservable = this.travelService.list();

      documentObservable.pipe(
        first()
      ).subscribe((data: any) => {
        console.log('data - TravelListingResolver - resolve()', data);
        resolve(documentObservable);
      });
    });
  }
}
