import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { SubjectFetch } from '../utils/subject-fetch';

import { TravelListingModel } from './travel-listing.model';

@Injectable()
export class TravelService {
  private _documentsCache: SubjectFetch<TravelListingModel>;

  constructor(private http: HttpClient) { }

  public list(): Observable<TravelListingModel> {
    // Use cache if we have it.
    if (!this._documentsCache) {
      const listingShell: TravelListingModel = new TravelListingModel();
      this._documentsCache = new SubjectFetch(
        listingShell,
        () => this.http.get<TravelListingModel>('./assets/sample-data/travel-listing.json')
      );
    }

    return this._documentsCache.observable;
  }
}
