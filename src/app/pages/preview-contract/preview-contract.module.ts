import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreviewContractPageRoutingModule } from './preview-contract-routing.module';

import { PreviewContractPage } from './preview-contract.page';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreviewContractPageRoutingModule,
    NgxExtendedPdfViewerModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [PreviewContractPage]
})
export class PreviewContractPageModule {}
