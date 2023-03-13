import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewIndividualListingPage } from './view-individual-listing.page';

const routes: Routes = [
  {
    path: '',
    component: ViewIndividualListingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewIndividualListingPageRoutingModule {}
