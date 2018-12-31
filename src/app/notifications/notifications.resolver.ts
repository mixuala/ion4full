import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsResolver implements Resolve<any> {

  constructor(private notificationsService: NotificationsService) { }

    resolve() {

    return new Promise((resolve, reject) => {

      this.notificationsService.getData()
      .then(
        data => {
          return resolve(data);
        },
        err => {
          return reject();
        }
      );
    });
  }
}
