import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReplayPage } from './replay.page';

const routes: Routes = [
  {
    path: '',
    component: ReplayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReplayPageRoutingModule {}
