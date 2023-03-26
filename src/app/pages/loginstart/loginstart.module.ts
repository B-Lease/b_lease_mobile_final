import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginstartPageRoutingModule } from './loginstart-routing.module';

import { LoginstartPage } from './loginstart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginstartPageRoutingModule
  ],
  declarations: [LoginstartPage]
})
export class LoginstartPageModule {}
