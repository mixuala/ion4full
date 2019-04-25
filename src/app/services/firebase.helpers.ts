import * as firebase from 'firebase/app';
import { timer } from 'rxjs';
import { takeWhile, } from 'rxjs/operators';



export class Helpful {
  // e.g. pick( target, ...keys )
  static pick = (O:any, ...K:string[]) => K.reduce((o, k) => (O&&O[k]?o[k]=O[k]:0, o), {});

  // e.g. sortByids( data, ids)
  static sortByIds = (O:any[], ids:string[])=>{
    const dict = O.reduce( (d,o)=>(d[o.id]=o, d), {});
    return ids.map( k=>dict[k] );
  }

  // e.g. rateLimit( tasks, (task)=>{ // do something }, [500ms] )
  // limit Firebase trn rate, useful for ETL from client
  static rateLimit(chores:any[], action:(task:any)=>any, delay=500):Promise<any>{
    return new Promise( (resolve, reject)=>{
      const waitFor = [];
      timer(0,delay).pipe( 
        takeWhile(()=>chores.length>0), 
      ).subscribe( _=>{
        const task = chores.shift()
        waitFor.push( action(task) );
      }
      , (err)=>{ reject(err) }
      , ()=>{ // complete
        console.log("rateLimit complete");
        resolve(Promise.all(waitFor));
      });
    })
  }

  /**
   * see: https://medium.com/@dneimke/generic-firebase-data-access-63ebd0506d53 
   */
  // encode imageUri as JPEG 
  static encodeImageUri(imageUri, callback, quality=80) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg", quality);
      callback(dataURL);
    };
    img.src = imageUri;
  };

  static uploadImage(imageURI, randomId):Promise<string>{
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
