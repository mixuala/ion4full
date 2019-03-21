import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseService, } from '../services/firebase.service';


import { RAW_DEMO_DATA, jsonEncode, jsonEscape, PICSUM_IDS } from '../../assets/sample-data/mappi-demo-data'

@Component({
  selector: 'app-playground',
  templateUrl: './playground.page.html',
  styleUrls: ['./playground.page.css'],
})
export class PlaygroundPage implements OnInit {

  user: any;
  items$: Observable<any>;
  get$: Observable<any>;

  constructor(
    public loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { 

    console.log( "use 'check' from DevConsole to access Playground")
    window['check'] = this;
  }

  ngOnInit() {
    if (this.route && this.route.data) {
      this.getRouteData();
    }
  }


  async getRouteData(){
    // const loading = await this.loadingCtrl.create({
    //   message: 'Please wait...'
    // });
    // await loading.present();

    this.route.data.subscribe(routeData => {
      routeData['data'].subscribe(data => {
        // loading.dismiss();
        // NOTE: this is actually the AngularFireAuth.user, not the /users collection
        this.user = data;  
      })
    })
  }

}
