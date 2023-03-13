import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreviewLeaseRequestPageRoutingModule } from './preview-lease-request-routing.module';
import { PreviewLeaseRequestPage } from './preview-lease-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreviewLeaseRequestPageRoutingModule
  ],
  declarations: [PreviewLeaseRequestPage]
})
export class PreviewLeaseRequestPageModule {}
