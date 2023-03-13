import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { SetContractPageRoutingModule } from './set-contract-routing.module';

import { SetContractPage } from './set-contract.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetContractPageRoutingModule,
    HttpClientModule,
    SetContractPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SetContractPage]
})
export class SetContractPageModule {}
