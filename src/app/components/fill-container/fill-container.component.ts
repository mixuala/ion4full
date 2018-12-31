import { Component, Input, ElementRef, Renderer2, ViewEncapsulation, OnChanges } from '@angular/core';

@Component({
  selector: 'app-fill-container',
  templateUrl: './fill-container.component.html',
  styleUrls: [
    './fill-container.component.scss'
  ]
})
export class FillContainerComponent implements OnChanges {
  _ratio: { w: number, h: number };

  constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {}

  @Input() set ratio(ratio: { w: number, h: number }) {
    this._ratio = ratio || {w: 1, h: 1};
  }

  ngOnChanges() {
    const ratio_height = (this._ratio.h / this._ratio.w * 100) + '%';
    // Conserve aspect ratio (see: http://stackoverflow.com/a/10441480/1116959)
    this._renderer.setStyle(this._elementRef.nativeElement, 'padding', '0px 0px ' + ratio_height + ' 0px');
  }
}
