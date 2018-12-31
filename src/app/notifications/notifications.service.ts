import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class NotificationsService {
  constructor(private http: HttpClient) {}

  getData(): Promise<any> {
    return this.http.get('./assets/sample-data/notifications.json')
     .toPromise()
     .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
