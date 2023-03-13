import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewIndividualListingPageRoutingModule } from './view-individual-listing-routing.module';

import { ViewIndividualListingPage } from './view-individual-listing.page';
//import { SwiperModule } from 'swiper/types/shared';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewIndividualListingPageRoutingModule,
    
  ],
  declarations: [ViewIndividualListingPage]
})
export class ViewIndividualListingPageModule {}
