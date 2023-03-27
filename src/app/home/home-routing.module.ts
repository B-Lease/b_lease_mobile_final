import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children:[
      {
        path:'dashboard',
        children:[
          {
            path:'',
            loadChildren: () => import('../pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
          }
        ]
      },
      // {
      //   path:'dashboard',
      //   children:[
      //     {
      //       path:'',
      //       loadChildren: () => import('../pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
      //     }
      //   ]
      // },
      {
        path:'inbox',
        children:[
          {
            path:'',
            loadChildren: () => import('../pages/list-of-messages/list-of-messages.module').then( m => m.ListOfMessagesPageModule)
          }
        ]
      },
      // {
      //   path:'inbox',
      //   children:[
      //     {
      //       path:'',
      //       loadChildren: () => import('../pages/list-of-messages/list-of-messages.module').then( m => m.ListOfMessagesPageModule)
      //     }
      //   ]
      // },
      {
        path:'profile',
        children:[
          {
            path:'',
            loadChildren: () => import('../pages/profile/profile.module').then( m => m.ProfilePageModule)
          }
        ]
      },
      {
        path:'',
        redirectTo:'dashboard',
        pathMatch:'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
