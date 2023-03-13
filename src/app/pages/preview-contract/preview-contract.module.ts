import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreviewContractPageRoutingModule } from './preview-contract-routing.module';

import { PreviewContractPage } from './preview-contract.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreviewContractPageRoutingModule
  ],
  declarations: [PreviewContractPage]
})
export class PreviewContractPageModule {}
