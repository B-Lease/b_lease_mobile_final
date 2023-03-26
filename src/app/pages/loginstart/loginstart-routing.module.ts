import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginstartPage } from './loginstart.page';

const routes: Routes = [
  {
    path: '',
    component: LoginstartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginstartPageRoutingModule {}
