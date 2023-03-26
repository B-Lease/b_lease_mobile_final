import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GetpropertyaddressPageRoutingModule } from './getpropertyaddress-routing.module';

import { GetpropertyaddressPage } from './getpropertyaddress.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GetpropertyaddressPageRoutingModule
  ],
  declarations: [GetpropertyaddressPage]
})
export class GetpropertyaddressPageModule {}
