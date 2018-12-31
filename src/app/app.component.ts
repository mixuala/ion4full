import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Events, MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  appPages = [
    {
      title: 'Categories',
      url: '/app/tabs/(home:categories)',
      icon: 'list-box'
    },
    {
      title: 'Profile',
      url: 'app/tabs/(profile:profile)',
      icon: 'person'
    },
    {
      title: 'Notifications',
      url: 'app/tabs/(notifications:notifications)',
      icon: 'notifications'
    }
  ];
  accountPages = [
    {
      title: 'Log In',
      url: 'auth/login',
      icon: 'log-in'
    },
    {
      title: 'Sign Up',
      url: 'auth/signup',
      icon: 'person-add'
    },
    {
      title: 'Tutorial',
      url: '/walkthrough',
      icon: 'hammer'
    },
    {
      title: 'Getting Started',
      url: '/getting-started',
      icon: 'color-wand'
    },
    {
      title: '404 page',
      url: '/page-not-found',
      icon: 'warning'
    }
  ];

  constructor(
    private events: Events,
    private menu: MenuController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
