import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertyFavoritesPage } from './property-favorites.page';

const routes: Routes = [
  {
    path: '',
    component: PropertyFavoritesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyFavoritesPageRoutingModule {}
