import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditIndividualListingPageRoutingModule } from './edit-individual-listing-routing.module';

import { EditIndividualListingPage } from './edit-individual-listing.page';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditIndividualListingPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditIndividualListingPage]
})
export class EditIndividualListingPageModule {}
