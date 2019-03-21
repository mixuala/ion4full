import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Injectable()
export class PlaygroundResolver implements Resolve<any> {

  constructor(private firebaseService: FirebaseService) {}

  resolve() {
    // HACK: use AngularFireAuth.user instead of users collection
    return this.firebaseService.getCurrentUser();
  }
}
