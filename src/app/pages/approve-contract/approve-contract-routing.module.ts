import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApproveContractPage } from './approve-contract.page';

const routes: Routes = [
  {
    path: '',
    component: ApproveContractPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApproveContractPageRoutingModule {}
