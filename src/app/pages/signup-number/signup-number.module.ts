import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupNumberPageRoutingModule } from './signup-number-routing.module';

import { SignupNumberPage } from './signup-number.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupNumberPageRoutingModule
  ],
  declarations: [SignupNumberPage]
})
export class SignupNumberPageModule {}
