import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddComplaintPageRoutingModule } from './add-complaint-routing.module';

import { AddComplaintPage } from './add-complaint.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddComplaintPageRoutingModule
  ],
  declarations: [AddComplaintPage]
})
export class AddComplaintPageModule {}
