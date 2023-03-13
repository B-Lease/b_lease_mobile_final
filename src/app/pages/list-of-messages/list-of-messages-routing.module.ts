import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListOfMessagesPage } from './list-of-messages.page';

const routes: Routes = [
  {
    path: '',
    component: ListOfMessagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListOfMessagesPageRoutingModule {}
