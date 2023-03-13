import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountDeactivationPageRoutingModule } from './account-deactivation-routing.module';

import { AccountDeactivationPage } from './account-deactivation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountDeactivationPageRoutingModule
  ],
  declarations: [AccountDeactivationPage]
})
export class AccountDeactivationPageModule {}
