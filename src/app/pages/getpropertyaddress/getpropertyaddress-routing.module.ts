import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GetpropertyaddressPage } from './getpropertyaddress.page';

const routes: Routes = [
  {
    path: '',
    component: GetpropertyaddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetpropertyaddressPageRoutingModule {}
