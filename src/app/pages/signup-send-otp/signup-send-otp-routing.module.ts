import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupSendOtpPage } from './signup-send-otp.page';

const routes: Routes = [
  {
    path: '',
    component: SignupSendOtpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupSendOtpPageRoutingModule {}
