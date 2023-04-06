import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children:[
      {
        path:'',
        redirectTo:'dashboard',
        pathMatch:'full'
      },
      {
        path:'dashboard',
        loadChildren: () => import('../pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)

      },
      {
        path:'inbox',
        loadChildren: () => import('../pages/list-of-messages/list-of-messages.module').then( m => m.ListOfMessagesPageModule)
      },
 
      {
        path:'transactions',
            loadChildren: () => import('../pages/transactions/transactions.module').then( m => m.TransactionsPageModule)
      },
      {
        path:'userprofile',
       loadChildren: () => import('../pages/profile/profile.module').then( m => m.ProfilePageModule)
      
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
