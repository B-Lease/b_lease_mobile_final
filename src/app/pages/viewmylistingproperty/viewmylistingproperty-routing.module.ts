import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewmylistingpropertyPage } from './viewmylistingproperty.page';

const routes: Routes = [
  {
    path: '',
    component: ViewmylistingpropertyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewmylistingpropertyPageRoutingModule {}
