import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnalysisPage } from './analysis.page';

const routes: Routes = [
  {
    path: '',
    component: AnalysisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalysisPageRoutingModule {}
