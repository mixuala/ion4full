import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlaygroundPage } from './playground.page';
import { PlaygroundResolver } from './playground.resolver';
import { ComponentsModule } from '../components/components.module';


const routes: Routes = [
  {
    path: '',
    component: PlaygroundPage,
    resolve: {
      data: PlaygroundResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PlaygroundPage],
  providers: [
    PlaygroundResolver
  ]
})
export class PlaygroundPageModule {}
