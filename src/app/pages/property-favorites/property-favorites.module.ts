import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropertyFavoritesPageRoutingModule } from './property-favorites-routing.module';

import { PropertyFavoritesPage } from './property-favorites.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PropertyFavoritesPageRoutingModule
  ],
  declarations: [PropertyFavoritesPage]
})
export class PropertyFavoritesPageModule {}
