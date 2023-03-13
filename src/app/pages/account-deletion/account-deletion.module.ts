import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountDeletionPageRoutingModule } from './account-deletion-routing.module';

import { AccountDeletionPage } from './account-deletion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountDeletionPageRoutingModule
  ],
  declarations: [AccountDeletionPage]
})
export class AccountDeletionPageModule {}
