import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupstartPage } from './signupstart.page';

const routes: Routes = [
  {
    path: '',
    component: SignupstartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupstartPageRoutingModule {}
