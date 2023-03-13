import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetContractPage } from './set-contract.page';

const routes: Routes = [
  {
    path: '',
    component: SetContractPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetContractPageRoutingModule {}
