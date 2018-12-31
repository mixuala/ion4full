import { Component, ViewEncapsulation, OnInit, AfterViewInit, ViewChild, HostBinding } from '@angular/core';

import { Slides, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.page.html',
  styleUrls: ['./walkthrough.page.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WalkthroughPage implements OnInit, AfterViewInit {
  @ViewChild(Slides) slides: Slides;
  @HostBinding('class.first-slide-active') isFirstSlide = true;
  @HostBinding('class.last-slide-active') isLastSlide = false;

  constructor(public menu: MenuController) { }

  ngOnInit() {
    this.menu.enable(false);
  }

  ngAfterViewInit() {
    // ViewChild is set
    this.slides.isBeginning().then(isBeginning => {
      this.isFirstSlide = isBeginning;
    });
    this.slides.isEnd().then(isEnd => {
      this.isLastSlide = isEnd;
    });

    // Subscribe to changes
    this.slides.ionSlideWillChange.subscribe(changes => {
      this.slides.isBeginning().then(isBeginning => {
        this.isFirstSlide = isBeginning;
      });
      this.slides.isEnd().then(isEnd => {
        this.isLastSlide = isEnd;
      });
    });
  }

  skipWalkthrough() {
    // Skip to the last slide
    this.slides.length().then(length => {
      this.slides.slideTo(length);
    });
  }
}
