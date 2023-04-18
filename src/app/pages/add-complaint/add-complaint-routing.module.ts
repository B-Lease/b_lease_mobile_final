import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddComplaintPage } from './add-complaint.page';

const routes: Routes = [
  {
    path: '',
    component: AddComplaintPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddComplaintPageRoutingModule {}
