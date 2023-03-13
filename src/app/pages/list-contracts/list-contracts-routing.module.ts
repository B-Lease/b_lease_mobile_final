import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListContractsPage } from './list-contracts.page';

const routes: Routes = [
  {
    path: '',
    component: ListContractsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListContractsPageRoutingModule {}
