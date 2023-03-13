import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyListingPage } from './my-listing.page';

const routes: Routes = [
  {
    path: '',
    component: MyListingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyListingPageRoutingModule {}
