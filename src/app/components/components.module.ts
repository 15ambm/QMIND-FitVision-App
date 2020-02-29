import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PhotoCanvasComponent } from './photo-canvas/photo-canvas.component';

const COMPONENTS = [
  PhotoCanvasComponent
]

@NgModule({
  declarations: [
    COMPONENTS
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    COMPONENTS
  ]
})
export class ComponentsModule { }
