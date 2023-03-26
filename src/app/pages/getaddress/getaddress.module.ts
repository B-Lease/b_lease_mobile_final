import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GetaddressPageRoutingModule } from './getaddress-routing.module';

import { GetaddressPage } from './getaddress.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GetaddressPageRoutingModule
  ],
  declarations: [GetaddressPage],

})
export class GetaddressPageModule {}
