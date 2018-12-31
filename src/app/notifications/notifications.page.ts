import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss']
})
export class NotificationsPage implements OnInit {

  notifications;

  constructor(
    private route: ActivatedRoute
  ) {}

    ngOnInit() {
      this.route.data.subscribe(routeData => {
        this.notifications = routeData['data'];
      });
    }

}
