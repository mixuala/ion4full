import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';
import { first, delay } from 'rxjs/operators';

import { FashionService } from './fashion.service';

@Injectable()
export class FashionListingResolver implements Resolve<any> {

  constructor(
    private fashionService: FashionService
  ) {}

  resolve() {
    return new Promise((resolve, reject) => {
      const documentObservable = this.fashionService.list();

      documentObservable.pipe(
        first()
      ).subscribe((data: any) => {
        console.log('data - FashionListingResolver - resolve()', data);
        resolve(documentObservable);
      });
    });
  }
}
