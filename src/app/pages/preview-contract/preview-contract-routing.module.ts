import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreviewContractPage } from './preview-contract.page';

const routes: Routes = [
  {
    path: '',
    component: PreviewContractPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreviewContractPageRoutingModule {}
