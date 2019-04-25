import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class PlaygroundResolver implements Resolve<any> {

  constructor(
    private authService: AuthService,
  ) {}

  resolve() {
    // HACK: use AngularFireAuth.user instead of users collection
    return this.authService.getCurrentUser();
  }
}
