import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CustomCheckboxComponent } from './custom-checkbox/custom-checkbox.component';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
import { FillContainerComponent } from './fill-container/fill-container.component';
import { TextShellComponent } from './text-shell/text-shell.component';
import { PreloadImageComponent } from './preload-image/preload-image.component';
import { BackgroundImageComponent } from './background-image/background-image.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
  ],
  declarations: [
    CustomCheckboxComponent,
    ShowHidePasswordComponent,
    FillContainerComponent,
    TextShellComponent,
    PreloadImageComponent,
    BackgroundImageComponent
  ],
  exports: [
    CustomCheckboxComponent,
    ShowHidePasswordComponent,
    FillContainerComponent,
    TextShellComponent,
    PreloadImageComponent,
    BackgroundImageComponent
  ],
  entryComponents: [],
})
export class ComponentsModule {}
