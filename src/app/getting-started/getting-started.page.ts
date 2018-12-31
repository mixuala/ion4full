import { Component, ViewEncapsulation, OnInit, AfterViewInit, ViewChild, HostBinding } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Slides, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.page.html',
  styleUrls: ['./getting-started.page.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class GettingStartedPage implements OnInit, AfterViewInit {
  @ViewChild(Slides) slides: Slides;
  @HostBinding('class.last-slide-active') isLastSlide = false;

  gettingStartedForm: FormGroup;

  constructor(public menu: MenuController) {
    this.gettingStartedForm = new FormGroup({
      browsingCategory: new FormControl('men'),
      followingInterests: new FormGroup({
        tops: new FormControl(),
        dresses: new FormControl(),
        jeans: new FormControl(),
        jackets: new FormControl(),
        shoes: new FormControl(),
        glasses: new FormControl()
      })
    });
  }

  ngOnInit() {
    this.menu.enable(false);
  }

  ngAfterViewInit() {
    // ViewChild is set
    this.slides.isEnd().then(isEnd => {
      this.isLastSlide = isEnd;
    });

    // Subscribe to changes
    this.slides.ionSlideWillChange.subscribe(changes => {
      this.slides.isEnd().then(isEnd => {
        this.isLastSlide = isEnd;
      });
    });
  }
}
