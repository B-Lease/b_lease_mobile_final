import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage } from './dashboard/dashboard.page';
import { ListOfMessagesPage } from './list-of-messages/list-of-messages.page';
import { NotificationPage } from './notification/notification.page';
import { ProfilePage } from './profile/profile.page';

const routes: Routes = [
    { path: 'dashboard', component: DashboardPage },
    { path: 'list-of-messages', component: ListOfMessagesPage },
    { path: 'notification', component: NotificationPage },
    { path: 'profile', component: ProfilePage },



    // other routes here
  ];

@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
],
  exports: [FooterComponent]
})
export class SharedModule { }