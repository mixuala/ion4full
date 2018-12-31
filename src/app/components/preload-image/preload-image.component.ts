import { Component, ViewEncapsulation, Input, HostBinding, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-preload-image',
  templateUrl: './preload-image.component.html',
  styleUrls: [
    './preload-image.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class PreloadImageComponent {
  _src = '';
  _ratio: { w: number, h: number };

  @HostBinding('style.padding') ratioPadding = '0px';
  @HostBinding('class.img-loaded') imageLoaded = false;

  @Input()
  set ratio(ratio: { w: number, h: number }) {
    this._ratio = (ratio !== undefined && ratio !== null) ? ratio : {w: 1, h: 1};

    const ratio_height = (this._ratio.h / this._ratio.w * 100) + '%';
    // Conserve aspect ratio (see: http://stackoverflow.com/a/10441480/1116959)
    this.ratioPadding = '0px 0px ' + ratio_height + ' 0px';
  }

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
    this.imageLoaded = true;
  }
}
