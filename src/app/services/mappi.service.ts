import { Injectable } from '@angular/core';
import { 
  AngularFirestore, QueryFn 
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BaseService, IBaseEntity, IBaseService} from '../services/firebase.service';

import { Observable, combineLatest, of } from 'rxjs';
import { map, take, takeUntil,  } from 'rxjs/operators';

import { Helpful } from './firebase.helpers'; 


export abstract class RestyFirebaseService<T extends IBaseEntity> extends BaseService<T> {

  static cleanProperties(o, keys?:string[]){
    let whitelist = Object.keys(o).filter( k=>!k.startsWith('_'));
    if (keys)
      whitelist = keys.filter( k=>whitelist.includes(k));

    return Helpful.pick( o, ...whitelist);
  }

  public className:string;

  constructor(path, ...params){
    super( path, params[0], params[1]);
    this.className = path;
  }

  /**
   * same as SubjectiveServe.get$( uuids ), 
   * use Observable instead of Resty<T>.get():Promise<T>
   * @param uuid 
   */
  list$( uuid?:string[]): Observable<T[]> {
    if ( uuid === undefined ) return super.list();

    if (uuid.length) {
      // combineLatest to merge stream of Observables
      return combineLatest( 
        ...uuid.map( id=>this.get(id) )
        , (...all)=>{
          // exclude undefined
          return all.filter(o=>!!o)
        }
      );
    }

    return of([]);
  }

  listWhere$(where: QueryFn): Observable<T[]> {
    return this.afs.collection<T>(this.path, where)
    .snapshotChanges()
    .pipe(
      takeUntil( this.unsubscribe$ ),
      map(actions => {
        return actions.map( a => {
          if (a.payload.doc) {
            /* workaround until spread works with generic types */
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          }
        }); 
      })
    );
  }

  get$(uuid:string):Observable<T>{
    this['get$_'] = this['get$_'] || {};      // cache
    const cached$ = this['get$_'][uuid];
    // TODO: is there a flatMap or switchMap that 
    // implicitly caches for view templates?
    if (cached$) return cached$ as Observable<T>;

    return this['get$_'][uuid] = super.get(uuid) as Observable<T>;
  }

  // deprecate: for back compatibility with Resty
  getP(uuids:string | string[]):Promise<T[]>{
    if (uuids instanceof Array)
      return this.list$(uuids).pipe(take(1)).toPromise();
    else if (uuids==='all')
      return this.list().pipe(take(1)).toPromise();
    else return Promise.resolve([]);
  }

  /**
   * <T> belongsToOne <ParentClass> 
   *    Parent hasMany T
   * @param parent { id: string, [fk]: string}
   * @param fk (optional) foreign key, defaults to parent['className']
   */
  belongsTo$( parent:any, fk?:string,  ): Observable<T[]> {
    fk = fk || parent['className'];
    let where:QueryFn = (ref)=>{
      // belongsTo One, e.g. T.fk=Parent.id
      // return ref.where(`${fk}.${parent.id}`,'==', true);
      return ref.where(`Marker.${parent.id}`,'==', parent.className);
    }
    return this.afs.collection<T>(this.path, where)
    .snapshotChanges()
    .pipe(
      takeUntil( this.unsubscribe$ ),
      map(actions => {
        return actions.map( a => {
          if (a.payload.doc) {
            /* workaround until spread works with generic types */
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          }
        });
      })
    );
  }

  // see: https://angularfirebase.com/lessons/firestore-advanced-usage-angularfire/#3-CRUD-Operations-with-Server-Timestamps
  post(item: T, isPublic:boolean=false ):Promise<T>{
    item = RestyFirebaseService.cleanProperties(item) as T;
    // item['created'] = new Date(); // TODO: deprecate
    item['c'] = this.timestamp();
    return super.add(item, isPublic); // or super.upsert()
  }

  // see: https://angularfirebase.com/lessons/firestore-advanced-usage-angularfire/#3-CRUD-Operations-with-Server-Timestamps  
  put(uuid:string, item:T, fields?:string[]):Promise<T>{
    if (uuid != item.id) {
      console.warn("ERROR: uuid does not match", uuid, item);
      return Promise.reject(`ERROR: uuid does not match, uuid=${uuid}`);
    }
    item = RestyFirebaseService.cleanProperties(item, fields) as T;
    // item['modified'] = new Date(); // TODO: deprecate
    item['m'] = this.timestamp();
    return super.update(item); // or super.upsert()
  }

}



/**
 * Mappi db Services
 */
@Injectable({
  providedIn: 'root'
})
export class PhotoService extends RestyFirebaseService<any> {
  constructor(
    afs: AngularFirestore,
    afAuth: AngularFireAuth,
  ){
    const path = 'Photo';
    super(path, afs, afAuth);
  }
}

@Injectable({
  providedIn: 'root'
})
export class MarkerGroupService extends RestyFirebaseService<any> {
  constructor(
    afs: AngularFirestore,
    afAuth: AngularFireAuth,
  ){
    const path = 'MarkerGroup';
    super(path, afs, afAuth);
  }
}

@Injectable({
  providedIn: 'root'
})
export class MarkerLinkService extends RestyFirebaseService<any> {
  constructor(
    afs: AngularFirestore,
    afAuth: AngularFireAuth,
  ){
    const path = 'MarkerLink';
    super(path, afs, afAuth);
  }
}

@Injectable({
  providedIn: 'root'
})
export class MarkerListService extends RestyFirebaseService<any> {
  constructor(
    afs: AngularFirestore,
    afAuth: AngularFireAuth,
  ){
    const path = 'MarkerList';
    super(path, afs, afAuth);
  }
}

// deprecate: use FavoriteService instead
@Injectable({
  providedIn: 'root'
})
export class OwnerService extends RestyFirebaseService<any> {
  constructor(
    afs: AngularFirestore,
    afAuth: AngularFireAuth,
  ){
    const path = 'Owner';
    super(path, afs, afAuth);
  }
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteService extends RestyFirebaseService<any> {
  constructor(
    afs: AngularFirestore,
    afAuth: AngularFireAuth,
  ){
    const path = 'Favorite';
    super(path, afs, afAuth);
  }
}

@Injectable({
  providedIn: 'root'
})
export class MappiService {
  public uid: string;
  constructor(
    public Photo: PhotoService,
    public MarkerGroup: MarkerGroupService,
    public MarkerLink: MarkerLinkService,
    public MarkerList: MarkerListService,
    public Favorite: FavoriteService,
    public Owner: OwnerService,  // deprecate
  ){
    this.Owner.getCurrentUser().then( v=>this.uid=v.uid)
   }
  

}