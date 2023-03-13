import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListOfListingsPage } from './list-of-listings.page';

const routes: Routes = [
  {
    path: '',
    component: ListOfListingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListOfListingsPageRoutingModule {}
