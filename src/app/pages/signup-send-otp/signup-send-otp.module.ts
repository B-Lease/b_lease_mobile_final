import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupSendOtpPageRoutingModule } from './signup-send-otp-routing.module';

import { SignupSendOtpPage } from './signup-send-otp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupSendOtpPageRoutingModule
  ],
  declarations: [SignupSendOtpPage]
})
export class SignupSendOtpPageModule {}
