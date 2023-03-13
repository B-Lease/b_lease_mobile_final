import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyListingPageRoutingModule } from './my-listing-routing.module';

import { MyListingPage } from './my-listing.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,

    MyListingPageRoutingModule
  ],
  declarations: [MyListingPage]
})
export class MyListingPageModule {}
