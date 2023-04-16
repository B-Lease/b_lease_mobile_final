import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditIndividualListingPage } from './edit-individual-listing.page';

const routes: Routes = [
  {
    path: '',
    component: EditIndividualListingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditIndividualListingPageRoutingModule {}
