import { Component, Input, ElementRef, Renderer2, ViewEncapsulation, OnChanges } from '@angular/core';

@Component({
  selector: 'app-text-shell',
  templateUrl: './text-shell.component.html',
  styleUrls: [
    './text-shell.component.scss'
  ]
})
export class TextShellComponent implements OnChanges {
  _data: '';

  @Input() set data(val: any) {
    this._data = (val !== undefined && val !== null) ? val : '';
  }

  constructor(private _elementRef: ElementRef, private _renderer: Renderer2) { }

  ngOnChanges() {
    this._update();
  }

  _update() {
    this._loaded(false);

    if (this._data && this._data !== '') {
      this._loaded(true);
    }
  }

  _loaded(isLoaded: boolean) {
    if (isLoaded) {
      this._renderer.addClass(this._elementRef.nativeElement, 'text-loaded');
    } else {
      this._renderer.removeClass(this._elementRef.nativeElement, 'text-loaded');
    }
  }
}
