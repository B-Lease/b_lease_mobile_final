import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListOfMessagesPageRoutingModule } from './list-of-messages-routing.module';

import { ListOfMessagesPage } from './list-of-messages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListOfMessagesPageRoutingModule
  ],
  declarations: [ListOfMessagesPage]
})
export class ListOfMessagesPageModule {}
