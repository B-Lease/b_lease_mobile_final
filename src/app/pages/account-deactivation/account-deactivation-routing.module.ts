import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountDeactivationPage } from './account-deactivation.page';

const routes: Routes = [
  {
    path: '',
    component: AccountDeactivationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountDeactivationPageRoutingModule {}
