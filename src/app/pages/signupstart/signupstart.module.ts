import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupstartPageRoutingModule } from './signupstart-routing.module';

import { SignupstartPage } from './signupstart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupstartPageRoutingModule
  ],
  declarations: [SignupstartPage]
})
export class SignupstartPageModule {}
