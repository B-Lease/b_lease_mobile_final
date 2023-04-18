import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComplaintThreadPageRoutingModule } from './complaint-thread-routing.module';

import { ComplaintThreadPage } from './complaint-thread.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComplaintThreadPageRoutingModule
  ],
  declarations: [ComplaintThreadPage]
})
export class ComplaintThreadPageModule {}
