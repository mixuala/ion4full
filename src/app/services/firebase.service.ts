import { Injectable } from '@angular/core';
import { 
  AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument,
  Action, DocumentSnapshotDoesNotExist, DocumentSnapshotExists,
  QueryFn
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
// import 'firebase/firestore';
import 'firebase/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subject, of } from 'rxjs';
import { map, take, takeUntil, } from 'rxjs/operators';



/**
 * see: https://medium.com/@dneimke/generic-firebase-data-access-63ebd0506d53 
 */
export interface IBaseService<T> {
  get(id: string): Observable<T>;
  list(): Observable<T[]>;
  add(item: T, isPublic?:boolean ): Promise<T>;
  update(item: T, isPublic?:boolean ): Promise<T>;
  delete(id: string): void;
}
export interface IBaseEntity {
  id?: string;
}

export abstract class BaseService<T extends IBaseEntity> implements IBaseService<T> {
// export abstract class BaseService<T> implements IBaseService<T> {

  protected collection: AngularFirestoreCollection<T>;
  protected currentUser: firebase.User;
  public unsubscribe$ : Subject<boolean> = new Subject<boolean>();
  public className: string;

  constructor(
    protected path: string, 
    protected afs: AngularFirestore,
    protected afAuth: AngularFireAuth,
    // private logger: ILogger,
  ){
    this.collection = this.afs.collection(path);
    // NOTE: every DB Class has a subscription to this.afAuth.user
    this.afAuth.user.pipe( takeUntil(this.unsubscribe$) ).subscribe(currentUser =>{
      if (currentUser) this.currentUser = currentUser;
    });
  }

  getCurrentUser():Promise<firebase.User>{
    return this.afAuth.user.pipe( take(1) ).toPromise();
  }
  
  async addOwnerid(item:T){
    if (!this.currentUser) {
      await this.getCurrentUser().then( o=>{
        if (o) this.currentUser = o;
        else return new Error("Please sign in");
      })
    }
    Object.assign(item, { 'ownerId': this.currentUser.uid });
  }

  timestamp(){
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  get(identifier: string): Observable<T> {
    // this.logger.logVerbose(`[BaseService] get: ${identifier}`);

    return this.collection
        .doc<T>(identifier)
        .snapshotChanges()
        .pipe(
            takeUntil(this.unsubscribe$),
            map(doc => {
                if (doc.payload.exists) {
		    /* workaround until spread works with generic types */
                    const data = doc.payload.data() as any;
                    const id = doc.payload.id;
                    return { id, ...data };
                }
            })
        );
  }


  list(): Observable<T[]> {
    // this.logger.logVerbose(`[BaseService] list`);

    return this.collection
        .snapshotChanges()
        .pipe(
            takeUntil(this.unsubscribe$),
            map(changes => {
                return changes.map(a => {
                    const data = a.payload.doc.data() as T;
                    data.id = a.payload.doc.id;
                    return data;
                });
            })
        );
  }

  // see: https://angularfirebase.com/lessons/firestore-advanced-usage-angularfire/#3-CRUD-Operations-with-Server-Timestamps
  add(item: T, isPublic:boolean=false): Promise<T> {
    // this.logger.logVerbose('[BaseService] adding item', item);
    
    if (!isPublic) this.addOwnerid(item);
    
    return this.collection.add(item).then(ref => {  
        const newItem = {
            id: ref.id,
            /* workaround until spread works with generic types */
            ...(item as any)
        };
        return newItem;
      }
    );
  }

  // TODO: add server timestamps
  // see: https://angularfirebase.com/lessons/firestore-advanced-usage-angularfire/#3-CRUD-Operations-with-Server-Timestamps
  update<T>(item: any, isPublic:boolean=false): Promise<T> {
      // this.logger.logVerbose(`[BaseService] updating item ${item.id}`);
      return this.collection
        .doc<T>(item.id)
        // use update() or upsert(?) instead set() to change only a subset of keys
        .update(item)
        .then( ()=>{
          return item as T // Partial<T>;
          return this.collection.doc<T>(item.id).valueChanges().pipe(take(1)).toPromise().then( o=>(o['id']=item.id, o)   );
        });

  }

  // see: https://angularfirebase.com/lessons/firestore-advanced-usage-angularfire/#4-Upsert-Update-or-Create-Method
  upsert<T>(item: any, isPublic:boolean=false): Promise<T> {
    if (!isPublic) this.addOwnerid(item);
    const docRef = this.collection
      .doc<T>(item.id);

    return docRef.snapshotChanges()
    .pipe(take(1))
    .toPromise()
    .then((snap: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
      const upsertAction = snap.payload.exists ? 'update' : 'set';
      return docRef[upsertAction](item).then(() => {
        return item as T;
        // return this.collection.doc<T>(item.id).valueChanges().pipe(take(1)).toPromise().then( o=>(o['id']=item.id, o)   );
      });
    })
  }

  delete(id: string): Promise<void> {
      // this.logger.logVerbose(`[BaseService] deleting item ${id}`);
      const docRef = this.collection.doc<T>(id);
      return docRef.delete();
  }


  /**
   * INCOMPLETE
   * toggle subscriptions between 'public' and 'owner' views
   * by changing where clause
   * 
   * BUT: how can we change the QueryFn dynamically? do we have to 
   * recreate the Observable?
   */
  logout() {
    console.warn('LOGOUT/unsubscribe functionality is INCOMPLETE');
    // TODO: is this actually the desired action?
    // unsubscribe to 'owner' view
    this.onDestroy();

    // resubscribe to 'public' view
    const ownerId = this.currentUser && this.currentUser.uid || null;
    const limitOwner:QueryFn = (ref)=>{
      // belongsTo One, e.g. T.fk=Parent.id
      return ref.where('ownerId','==', ownerId);
    }
  }

  onDestroy(){
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

}













export class Task {
  id: string;
  title: string;
  description: string;
  image: string;

}

@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseService<Task> {

  /**
   * usage:
   *    const afs = this.afs.collection('people').doc(currentUser.uid)
   *    new TaskService(afs)
   * @param afs 
   */
  constructor(
    afs: AngularFirestore,
    afAuth: AngularFireAuth,
  ){
    const path = 'tasks';
    super(path, afs, afAuth);
  }

}



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private snapshotChangesSubscription: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ){}

  // added for /app/tabs/profile
  getCurrentUser():Promise<Observable<firebase.User>>{
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser =>{
        const {email, displayName, uid } = currentUser;
        console.log( "currentUser", {email, displayName, uid});
        resolve(  of(currentUser)  );
      })
    })
  }

  getUsers():Promise<Observable<any>>{
    return new Promise<any>((resolve, reject) => {
      this.snapshotChangesSubscription = this.afs.collection('/users').valueChanges();
      resolve(this.snapshotChangesSubscription);
    })
  }


  getTasks(){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          this.snapshotChangesSubscription = this.afs.collection('people').doc(currentUser.uid).collection('tasks').snapshotChanges();
          resolve(this.snapshotChangesSubscription);
        }
      })
    })
  }

  getTask(taskId){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          this.snapshotChangesSubscription = this.afs.doc<any>('people/' + currentUser.uid + '/tasks/' + taskId).valueChanges()
          .subscribe(snapshots => {
            resolve(snapshots);
          }, err => {
            reject(err)
          })
        }
      })
    });
  }

  unsubscribeOnLogOut(){
    //remember to unsubscribe from the snapshotChanges
    this.snapshotChangesSubscription.unsubscribe();
  }

  updateTask(taskKey, value){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('tasks').doc(taskKey).set(value)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  deleteTask(taskKey){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('tasks').doc(taskKey).delete()
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  createTask(value){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('tasks').add({
        title: value.title,
        description: value.description,
        image: value.image
      })
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };

  uploadImage(imageURI, randomId){
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child('image').child(randomId);
      this.encodeImageUri(imageURI, function(image64){
        imageRef.putString(image64, 'data_url')
        .then(snapshot => {
          snapshot.ref.getDownloadURL()
          .then(res => resolve(res))
        }, err => {
          reject(err);
        })
      })
    })
  }
}
