import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupNumberPage } from './signup-number.page';

const routes: Routes = [
  {
    path: '',
    component: SignupNumberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupNumberPageRoutingModule {}
