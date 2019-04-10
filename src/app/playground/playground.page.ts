import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, } from 'rxjs';
import { map, } from 'rxjs/operators';
import { FirebaseService, } from '../services/firebase.service';
import { MappiService, } from '../services/mappi.service';



import { RAW_DEMO_DATA, jsonEncode, jsonEscape, PICSUM_IDS } from '../../assets/sample-data/mappi-demo-data'


const _pick = (O, ...K) => K.reduce((o, k) => (O&&O[k]?o[k]=O[k]:0, o), {});

@Component({
  selector: 'app-playground',
  templateUrl: './playground.page.html',
  styleUrls: ['./playground.page.css'],
})
export class PlaygroundPage implements OnInit {

  user: any;
  items$: Observable<any>;
  listBelongsTo$: Observable<any>;
  markerGroup$: Observable<any>;

  constructor(
    public loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private mappiService: MappiService,
  ) { 

    console.log( "use 'check' from DevConsole to access Playground")
    window['check'] = this;
  }

  ngOnInit() {
    if (this.route && this.route.data) {
      this.getRouteData();
    }

    this.getMappi();
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

  getById$(uuid:string, className:string):Observable<any>{
    this['getById$_'] = this['getById$_'] || {};      // cache
    const cached$ = this['getById$_'][uuid];
    if (cached$) return cached$;
    return this['getById$_'][uuid] = this.mappiService[className].get$(uuid)
    .pipe(
      map( o=>{
        const check = _pick(o, 'id', 'className', 'src');
        return check;
      })
    );
  }

  async getMappi(){
    this.items$ = this.mappiService.Photo.list().pipe( 
      map( (arr)=>arr.slice(0,3).map( o=>{
          const {id, uuid, position, src}=o
          return {id, uuid, position, src};
        })),
    )

    // async pipe pattern
    const mgUuid = '0abcd637-3b58-4d42-9f5b-89d83415b282'
    this.markerGroup$ = this.mappiService.MarkerGroup.get$(mgUuid);

    // hasMany$ pattern

    // belongsTo$ pattern
    const mList = '384e4987-00d9-4934-a401-985534bb896f';
    const fetch$ = [
      this.mappiService.MarkerGroup.belongsTo$('MarkerList', mList)
      , this.mappiService.MarkerLink.belongsTo$('MarkerList', mList)
    ];
    this.listBelongsTo$ = combineLatest( fetch$ ).pipe(
      map( arr=>[].concat.apply([], arr)),
      map( arr=>{
        return arr.map( o=>{
          const check = _pick(o, 'id', 'className', 'src');
          return check;
        });
      }),
    );



  }




  /**
   * Migration methods 
   * */ 
  // load demo data into firebase
  async loadMappi(){
    const data = JSON.parse(  jsonEncode( RAW_DEMO_DATA ) );
    const collections = ['MarkerGroup', 'MarkerLink', 'MarkerList', 'Photo'];

    
    collections.forEach( async (key)=>{
      data[key].forEach( (o,i)=>{
        this.mappiService[key].add(o).then( p=>{
          if (i%10==0) console.log(key, "index=", i, p);
        });
      });
    })

    const ownerData = data['unknown']['cache-Owner'];
    const key = "Owner";
    ownerData.forEach( (o,i)=>{
      this.mappiService[key].add(o).then( p=>{
        if (i%10==0) console.log(key, "index=", i, p);
      });
    });
  }

  async etl_patchForeignKeys(){
    const schema = {
      'Photo': {
        belongsTo: [{
          parent: 'MarkerGroup',
          key: 'markerItemIds',
        },],
      },
      'MarkerGroup': {
        belongsTo: [{
          parent: 'MarkerList',
          key: 'markerGroupIds',
        },],
      },
      'MarkerLink': {
        belongsTo: [{
          parent: 'MarkerGroup',
          key: 'markerItemIds',
        },
        {
          parent: 'MarkerList',
          key: 'markerGroupIds'
        }],
      },
    }
    setTimeout( _=>{
      Object.keys(schema).forEach( (childClass:any)=>{
        schema[childClass].belongsTo.forEach( (belongsTo)=>{
          this.mappiService[belongsTo.parent].list().subscribe( parents=>{
            parents.forEach( (parent,i)=>{
              const childIds = parent[belongsTo.key];
              if (childIds.length==0) return;
              childIds.forEach( async (childId)=>{
                try { 
                  const data = {id: childId, belongsTo: null };
                  data[`fk_${belongsTo.parent}`] = parent.uuid;
                  return this.mappiService[childClass].put( childId, data )
                  .then( ret=>{
                    const {className, id} = ret;
                    console.log( `parent=${i}, ${parent.className}`, {className, id} );
                  });
                } catch (err) {
                  console.warn(err);
                  debugger;
                }
              });
            });
          });
        });
      });
    });
    return
  }



}
