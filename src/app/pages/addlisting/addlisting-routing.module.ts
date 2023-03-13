import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddlistingPage } from './addlisting.page';

const routes: Routes = [
  {
    path: '',
    component: AddlistingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddlistingPageRoutingModule {}
