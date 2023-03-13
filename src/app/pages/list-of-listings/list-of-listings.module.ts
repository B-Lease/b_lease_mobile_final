import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListOfListingsPageRoutingModule } from './list-of-listings-routing.module';

import { ListOfListingsPage } from './list-of-listings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListOfListingsPageRoutingModule
  ],
  declarations: [ListOfListingsPage]
})
export class ListOfListingsPageModule {}
