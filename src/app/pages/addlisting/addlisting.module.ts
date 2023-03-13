import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { IonicModule } from '@ionic/angular';

import { AddlistingPageRoutingModule } from './addlisting-routing.module';

import { AddlistingPage } from './addlisting.page';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddlistingPageRoutingModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  declarations: [AddlistingPage]
})
export class AddlistingPageModule {}
