import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreviewLeaseRequestPage } from './preview-lease-request.page';

const routes: Routes = [
  {
    path: '',
    component: PreviewLeaseRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreviewLeaseRequestPageRoutingModule {}
