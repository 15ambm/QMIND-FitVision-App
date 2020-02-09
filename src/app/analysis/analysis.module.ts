import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnalysisPageRoutingModule } from './analysis-routing.module';
import { ComponentsModule } from '../components/components.module';

import { AnalysisPage } from './analysis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AnalysisPageRoutingModule
  ],
  declarations: [AnalysisPage]
})
export class AnalysisPageModule {}
