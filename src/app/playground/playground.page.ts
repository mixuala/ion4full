import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, of, from, timer} from 'rxjs';
import { map, flatMap, mergeMap, switchMap, take, takeWhile } from 'rxjs/operators';
import { MappiService, } from '../services/mappi.service';
import { Helpful } from '../services/firebase.helpers'; 



import { RAW_DEMO_DATA, jsonEncode, jsonEscape, PICSUM_IDS } from '../../assets/sample-data/mappi-demo-data'


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
  markerList$: Observable<any>;

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

  async ngOnInit() {
    if (this.route && this.route.data) {
      this.getRouteData();
    }

    this.getMappi();
    console.log(await this.mappiService.Owner.getCurrentUser())
  }


  async getRouteData(){
    // const loading = await this.loadingCtrl.create({
    //   message: 'Please wait...'
    // });
    // await loading.present();

    if (this.route && this.route.data) {
      this.route.data.subscribe( routeData=>{
        this.user=routeData['data'];
      });  
    }
  }

  getById$(uuid:string, className:string):Observable<any>{
    this['getById$_'] = this['getById$_'] || {};      // cache
    const cached$ = this['getById$_'][uuid];
    if (cached$) return cached$;
    return this['getById$_'][uuid] = this.mappiService[className].get$(uuid)
    .pipe(
      map( o=>{
        const check = Helpful.pick(o, 'id', 'className', 'src');
        return check;
      })
    );
  }

  belongsTo$(mList){
    // belongsTo$ pattern
    const mGroup$ = this.mappiService.MarkerGroup.belongsTo$(mList);
    const mLink$ = this.mappiService.MarkerLink.belongsTo$(mList);
    // combineLatest, see: https://firebase.googleblog.com/2018/09/introducing-rxfire-easy-async-firebase.html
    return combineLatest( 
      mGroup$, mLink$
      , (...all)=>{
        const merged = [].concat.apply([], all);
        // TODO: sort merged by mList.markerGroupIds
        return Helpful.sortByIds( merged, mList.markerGroupIds);
      }
    );
  }
  
  async getMappi(){
    // this.items$ = this.mappiService.Photo.list().pipe( 
    //   map( (arr)=>arr.slice(0,3).map( o=>{
    //     const {id, uuid, position, src}=o
    //     return {id, uuid, position, src};
    //   })),
    // );
      
    // async pipe pattern
    let mgUuids = ['0abcd637-3b58-4d42-9f5b-89d83415b282','2DYfTL7Xh2M6onOOTI97','P3GXOvADkm1CVsVwfDMI'];
    this.markerGroup$ = this.mappiService.MarkerGroup.list$(mgUuids)
    .pipe( map( arr=>arr.pop() ), );
    
    // belongsTo$ pattern
    let mListIds = ['384e4987-00d9-4934-a401-985534bb896f','wGBpDU6yxS7STcnNXrNK','rDiSSlowhe56NXgyd7VM'];
    this.markerList$ = this.mappiService.MarkerList.list$(mListIds);
    this.markerList$.pipe(
      take(1),
      map( arr=>arr.pop() ),
      switchMap( (mList)=>{  // mListId:onChanges(): switch to latest 
        this.listBelongsTo$ = this.belongsTo$(mList)
        .pipe(
          map( arr=>{
            return arr.map( o=>{
              return Helpful.pick(o, 'id', 'className', 'src');
            });
          }),
        );
        return mList;
      }),
    ).subscribe( mList=>{
      console.log(mList)
    });

    // Owner hasMany Favorites
    // where Favorite.ownerId == ownerId
    // where Favorite.markerId == MarkerXXX.id
    const ownerId = this.mappiService.uid;
    const favoriteIds$ = this.mappiService.Favorite.listWhere$((ref)=>{
      return ref.where(`ownerId`,'==',ownerId).where('favorite','==',true);
    }).pipe(
      map( items=>items.map(o=>o.markerId)),
      flatMap( favoriteIds=>{
        const mGroup$ = this.mappiService.MarkerGroup.list$(favoriteIds);
        const mLink$ = this.mappiService.MarkerLink.list$(favoriteIds);
        return combineLatest(
          mGroup$, mLink$
          ,(...all)=>{
            const merged = [].concat.apply([], all)
            // sort by seqIds
            return merged;
          }
        );
      }),
      map( all=>{
        return all;
      } )
    ).subscribe( o=>console.log('Favorites', o));


    
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

  getUuid2Ids():Promise<any>{
    return new Promise( resolve=>{
      const classList = ['MarkerList', 'MarkerLink', 'MarkerGroup','Photo','Favorite'];
      const uuid2id={};
      combineLatest(classList.map(className=>{
        return this.mappiService[className].list();
      })).pipe(take(1)).subscribe( (lists)=>{

        // to JSON
        const check = [...classList].reduce( (o,k,i)=>(o[k]=lists[i],o),{})
        const raw = jsonEscape(JSON.stringify(check));

        lists.forEach( items=>{
          items.forEach( o=>{
            const {id, className} = o;
            uuid2id[o.uuid] = {id, className};
          });
        });
        const count = Object.keys(uuid2id).length;
        console.log('uuid 2 ids',{count,uuid2id})
        return resolve(uuid2id);
      });
    });
  }


  async etl_Favorite(){
    const etlData = JSON.parse(  jsonEncode( RAW_DEMO_DATA ) );

    const uuid2ids = await this.getUuid2Ids();

    // this.etl_Favorite(etlData);
    const Owner = etlData.unknown['cache-Owner'];
    const ownerId = this.mappiService.uid;
    // convert Owner => Favorite
    this.mappiService.Owner.list$().pipe( 
      map( items=>{
        const favorites = items
        // .filter(o=>!!o.favorite)
        .map( o=>{
          const {uuid, favorite } = o;
          const mappedId = uuid2ids[uuid];
          const key = `${ownerId}_${mappedId.id}`;
          return {
            id: key,
            favorite,
            ownerId: ownerId,
            markerId: mappedId.id,
            marker: {
              className: mappedId.className,
              label: null,
            },
          }
        })
        console.log(favorites);
        return favorites;
      }),
    ).subscribe( items=>{
      Helpful.rateLimit( items, (task)=>{
        return this.mappiService.Favorite.post(task, false)
        .then( o=>console.log('Favorite',o) );
      })
    });
  }

  async etl_patchFirebaseIds(){

    const remapIds = ( uuid2id )=>{
      const classList = [
        'MarkerList', 'MarkerLink', 'MarkerGroup','Photo','Favorite'
      ];
      const tasks = [];
      const waitFor = classList.map(className=>{
        return new Promise( (resolve)=>{
          this.mappiService[className].list().pipe(take(1)).subscribe( items=>{
            items.forEach( item=>{
              let update = false;
              const data = {};
              [...classList, 'Marker'].map( key=>{
                if (item[key]) data[key] = item[key];
              });
              ['markerItemIds', 'markerGroupIds'].map( key=>{
                if (item[key]) data[key] = item[key];
              })
              // console.log (data);
              if (JSON.stringify(data)==="{}") 
                return;
              const data0 = Object.assign({}, data);
              Object.keys(data).forEach( className=>{
                if (typeof data[className]==='string') {
                  // [className]: [uuid]
                  const uuid = data[className]; 
                  const found = uuid2id[uuid];
                  if (!found)
                    return delete data[className];
                  data[className] = found.id;
                  update = true;
                }
                else if (['markerItemIds', 'markerGroupIds', 'markerLinkIds'].includes(className)){
                  const ids = [];
                  data[className].forEach( (uuid,i)=>{
                    const found = uuid2id[uuid];
                    if (found){
                      data['Marker'] = data['Marker'] || {};
                      data[found.className] = data[found.className] || {};
                      Object.assign(data['Marker'], {[found.id]: found.className});
                      Object.assign(data[found.className], {[found.id]: true});
                      ids.push(found.id);
                      update = true;
                    }
                    else ids.push(uuid);
                    return 
                  });
                  data[className] = ids
                }
                else {
                  // Marker: { [uuid]: [className]}
                  // [className]: { [uuid]: true }
                  Object.keys(data[className]).forEach( uuid=>{
                    const found = uuid2id[uuid];
                    if (found){
                      data[className][found.id] = data[className][uuid];
                      update = true;
                    }
                    return delete data[className][uuid];
                  });
                }
              });
              if (update){ 
                data['id'] = item.id;
                console.log({data, data0});
                tasks.push({className, data});
              } else {
                const check = data;
              }
            });  // end items.forEach()
            resolve('done');
            
          }); // end list().subscribe()
          
        });
      });
      Promise.all(waitFor).then( _=>{
        console.log({tasks});
        Helpful.rateLimit( tasks, ({className, data} )=>{
          return this.mappiService[className].put( data.id, data ).then( res=>{
            console.log ('mapped to Ids =>', data);
          });
        }).then( ()=>{
          console.log( ">>> remapIds complete")
        })
      })
    }

    setTimeout( async()=>{
      const uuid2ids = await this.getUuid2Ids();
      const count = Object.keys(uuid2ids).length;
      console.log({count,uuid2ids})
      remapIds(uuid2ids);
    });
  }

  async etl_patchForeignKeys(){
    const etlData = JSON.parse(  jsonEncode( RAW_DEMO_DATA ) );


    // this.etl_Favorite(etlData);


    const schema = {
      'Photo': {
        belongsTo: [{
          relation: 'belongsToOne',
          parent: 'MarkerGroup',
          key: 'markerItemIds',
        },],
      },
      'MarkerGroup': {
        belongsTo: [{
          relation: 'belongsToMany',
          parent: 'MarkerList',
          key: 'markerGroupIds',
        }],
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
      'MarkerList':{
        belongsTo: []
      }
    }

    setTimeout( async ()=>{
      const backlinks:any = {};

      const uuid2id={};
      const classList = Object.keys(schema);
      return await new Promise( resolve=>{
        // get existing items in Firebase, add to skip list
        combineLatest(classList.map(className=>{
          return this.mappiService[className].list();
        })).pipe(take(1)).subscribe( (lists)=>{
          lists.forEach( items=>{
            items.forEach( o=>{
              uuid2id[o.uuid] = o.id;
            });
          });
          const count = Object.keys(uuid2id).length;
          console.log({count,uuid2id});
          resolve(uuid2id);
        });
      }).then( (skip)=>{
        // add items to Firebase, skip existing
        const tasks = classList.map( (childClass)=>{
          return etlData[childClass].filter( o=>!skip[o.uuid])
        });
        const allItems =  [].concat(...tasks);
        return allItems;
      }).then( (items)=>{
        const tasks = items.map( (data:any)=>{
          const {className, uuid}  = data;
          const tasksA = schema[className]['belongsTo'].map( belongsTo=>{

            // childClass m:1/m belongsTo.parent
            const parents = etlData[belongsTo.parent].filter( parent=>{
              return parent[belongsTo.key].includes(data.uuid);
            });

            const tasksB = parents.map( parent=>{
              switch (belongsTo.relation) {
                case 'belongsToOne': 
                  // Photo m:1 MarkerGroup
                  Object.assign(data , {
                    // id: childId,
                    [`${belongsTo.parent}`]: parent.uuid
                  });
                  break;
                case 'belongsToMany': 
                  // MarkerGroup m:m MarkerList
                  Object.assign(data, {
                    // id: childId,
                    [`Marker`]: {[parent.uuid]: `${belongsTo.parent}`},
                    [`${belongsTo.parent}`]: {[parent.uuid]: true}
                  });
                  // TODO: add backlink
                break;
              }
              return data;
            });
            return [].concat(...tasksB);
          });
          return [].concat(...tasksA);
        });

        const all = [].concat(...tasks, items).reduce( (res, o)=>{
          res[o.uuid] = res[o.uuid] || o;
          return res;
        }, {});
        return all;

      }).then( (tasks)=>{
        console.log({tasks});
        Helpful.rateLimit( Object.values(tasks), (data)=>{
          return this.mappiService[data.className].post( data );
        }).then( ()=>{
          console.log( ">>> etl_patchForeignKeys complete")
        })

      });
          
    }); // setTimeout()
  }



}
