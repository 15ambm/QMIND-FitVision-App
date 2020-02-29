import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReplayPageRoutingModule } from './replay-routing.module';

import { ReplayPage } from './replay.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReplayPageRoutingModule
  ],
  declarations: [ReplayPage]
})
export class ReplayPageModule {}
