import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewmylistingpropertyPageRoutingModule } from './viewmylistingproperty-routing.module';

import { ViewmylistingpropertyPage } from './viewmylistingproperty.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewmylistingpropertyPageRoutingModule
  ],
  declarations: [ViewmylistingpropertyPage]
})
export class ViewmylistingpropertyPageModule {}
