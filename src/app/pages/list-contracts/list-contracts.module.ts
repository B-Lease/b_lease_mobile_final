import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListContractsPageRoutingModule } from './list-contracts-routing.module';

import { ListContractsPage } from './list-contracts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListContractsPageRoutingModule
  ],
  declarations: [ListContractsPage]
})
export class ListContractsPageModule {}
