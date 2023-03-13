import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApproveContractPageRoutingModule } from './approve-contract-routing.module';

import { ApproveContractPage } from './approve-contract.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApproveContractPageRoutingModule
  ],
  declarations: [ApproveContractPage]
})
export class ApproveContractPageModule {}
