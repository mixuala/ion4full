import { Component, ViewEncapsulation, Input, HostBinding, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-background-image',
  templateUrl: './background-image.component.html',
  styleUrls: [
    './background-image.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class BackgroundImageComponent {
  _src = '';

  @HostBinding('style.backgroundImage') backgroundImage: string;
  @HostBinding('class.img-loaded') imageLoaded = false;

  @Input()
  set src(val: string) {
    this._src = (val !== undefined && val !== null) ? val : '';

    // Show loading indicator
    // When using SSR (Server Side Rendering), avoid the loading animation while the image resource is being loaded
    if (isPlatformServer(this.platformId)) {
      this.imageLoaded = true;
    } else {
      this.imageLoaded = false;
    }
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  _imageLoaded() {
    this.backgroundImage = 'url(' + this._src + ')';
    this.imageLoaded = true;
  }
}
