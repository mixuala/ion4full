import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BaseService, IBaseEntity, IBaseService} from '../services/firebase.service';

import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';


/**
 * use item.uuid as custom key over firestore generated key
 */
export abstract class UuidBaseService<T extends IBaseEntity> extends BaseService<T> {

  add(item: T, isPublic:boolean=false): Promise<T> {
    // this.logger.logVerbose('[BaseService] adding item', item);
    
    const promise = new Promise<T>( async (resolve, reject) => {
        if (!isPublic) this.addOwnerid(item);
        /*
         * add item.uuid as custom key
         * use firestore.DocumentReference.doc() instead of AngularFireCollection.add()
         */
        const doc = item['uuid'] ? this.collection.ref.doc( item['uuid'] ) : this.collection.ref.doc();
        doc.set(item)
        .then(ref => {
            const newItem = {
                id: doc.id,     // ref.id
                /* workaround until spread works with generic types */
                ...(item as any)
            };
            resolve(newItem);
        });
    });
    return promise;
  }
}

export abstract class RestyFirebaseService<T extends IBaseEntity> extends UuidBaseService<T> {

  static cleanProperties(o, keys?:string[]){
    let whitelist = Object.keys(o).filter( k=>!k.startsWith('_'));
    if (keys)
      whitelist = keys.filter( k=>whitelist.includes(k));
    
    const clean = whitelist.reduce( (res,k)=>{
      res[k] = o[k];
      return res;
    },{});
    return clean;
  }

  /**
   * same as SubjectiveServe.get$( uuids ), 
   * use Observable instead of Resty<T>.get():Promise<T>
   * @param uuid 
   */
  list$( uuid?:string[] ): Observable<T[]> {
    if ( uuid === undefined ) return super.list();

    if (uuid.length) {
      // combineLatest to merge stream of Observables
      const res = uuid.map( id=>{
        return this.get(id);
      });
      return combineLatest( res );
    }
    // return uuid ? this.get(uuid) : of([]);
  }

  get$(uuid:string):Observable<T>{
    this['get$_'] = this['get$_'] || {};      // cache
    const cached$ = this['get$_'][uuid];
    if (cached$) return cached$ as Observable<T>;
    return this['get$_'][uuid] = this.get(uuid) as Observable<T>;
  }

  
  belongsTo$( fk_ClassName:string, fk_value:string ): Observable<T[]> {
    /**
     * OR, use child belongsTo parent pattern, instead of parent hasMany child
     * add FK to Child and use doc().where('fk','==',uuid)
     */
    const check = this.afs.collection<T>(this.path, (ref)=>{
      return ref.where(`fk_${fk_ClassName}`,'==',fk_value);
    });

    return check.snapshotChanges()
    .pipe(
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

  // TODO: add server timestamps
  // see: https://angularfirebase.com/lessons/firestore-advanced-usage-angularfire/#3-CRUD-Operations-with-Server-Timestamps
  post(item: T){
    item = RestyFirebaseService.cleanProperties(item) as T;
    item['created'] = new Date();
    item['createdAt'] = this.timestamp();
    return super.add(item); // or super.upsert()
  }

  // TODO: add server timestamps
  // see: https://angularfirebase.com/lessons/firestore-advanced-usage-angularfire/#3-CRUD-Operations-with-Server-Timestamps  
  put(uuid:string, item:T, fields?:string[]):Promise<T>{
    if (uuid != item.id) {
      console.warn("ERROR: uuid does not match", uuid, item);
      return Promise.reject(`ERROR: uuid does not match, uuid=${uuid}`);
    }
    item = RestyFirebaseService.cleanProperties(item, fields) as T;
    item['modified'] = new Date();
    item['modifiedAt'] = this.timestamp();
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
export class MappiService {
  constructor(
    public Photo: PhotoService,
    public MarkerGroup: MarkerGroupService,
    public MarkerLink: MarkerLinkService,
    public MarkerList: MarkerListService,
    public Owner: OwnerService,
  ){
  }
}