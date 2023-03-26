import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GetaddressPage } from './getaddress.page';

const routes: Routes = [
  {
    path: '',
    component: GetaddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetaddressPageRoutingModule {}
