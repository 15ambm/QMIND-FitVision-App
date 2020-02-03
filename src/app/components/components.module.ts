import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotoCanvasComponent } from './photo-canvas/photo-canvas.component';

const COMPONENTS = [
  PhotoCanvasComponent
]

@NgModule({
  declarations: [
    COMPONENTS
  ],
  imports: [
    CommonModule
  ],
  exports: [
    COMPONENTS
  ]
})
export class ComponentsModule { }
