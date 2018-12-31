import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { SubjectFetch } from '../utils/subject-fetch';

import { FashionListingModel } from './fashion-listing.model';

@Injectable()
export class FashionService {
  private _documentsCache: SubjectFetch<FashionListingModel>;

  constructor(private http: HttpClient) { }

  public list(): Observable<FashionListingModel> {
    // Use cache if we have it.
    if (!this._documentsCache) {
      const listingShell: FashionListingModel = new FashionListingModel();
      this._documentsCache = new SubjectFetch(
        listingShell,
        () => this.http.get<FashionListingModel>('./assets/sample-data/fashion-listing.json')
      );
    }

    return this._documentsCache.observable;
  }
}
