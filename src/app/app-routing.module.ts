import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LoginPage } from './pages/login/login.page';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'loginstart',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'list-of-listings',
    loadChildren: () => import('./pages/list-of-listings/list-of-listings.module').then( m => m.ListOfListingsPageModule)
  },
  {
    path: 'signup-number',
    loadChildren: () => import('./pages/signup-number/signup-number.module').then( m => m.SignupNumberPageModule)
  },
  {
    path: 'signup-send-otp',
    loadChildren: () => import('./pages/signup-send-otp/signup-send-otp.module').then( m => m.SignupSendOtpPageModule)
  },
  {
    path: 'set-contract',
    loadChildren: () => import('./pages/set-contract/set-contract.module').then( m => m.SetContractPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'account-deactivation',
    loadChildren: () => import('./pages/account-deactivation/account-deactivation.module').then( m => m.AccountDeactivationPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'account-deletion',
    loadChildren: () => import('./pages/account-deletion/account-deletion.module').then( m => m.AccountDeletionPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./pages/notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'file-to-report',
    loadChildren: () => import('./pages/file-to-report/file-to-report.module').then( m => m.FileToReportPageModule)
  },
  {
    path: 'guide',
    loadChildren: () => import('./pages/guide/guide.module').then( m => m.GuidePageModule)
  },
  {
    path: 'preview-contract/:propertyID',
    loadChildren: () => import('./pages/preview-contract/preview-contract.module').then( m => m.PreviewContractPageModule)
  },
  {
    path: 'list-contracts',
    loadChildren: () => import('./pages/list-contracts/list-contracts.module').then( m => m.ListContractsPageModule)
  },
  {
    path: 'approve-contract',
    loadChildren: () => import('./pages/approve-contract/approve-contract.module').then( m => m.ApproveContractPageModule)
  },
  {
    path: 'preview-lease-request',
    loadChildren: () => import('./pages/preview-lease-request/preview-lease-request.module').then( m => m.PreviewLeaseRequestPageModule)
  },

  {
    path: 'set-contract',
    loadChildren: () => import('./pages/set-contract/set-contract.module').then( m => m.SetContractPageModule)
  },
  {
    path: 'preview-contract',
    loadChildren: () => import('./pages/preview-contract/preview-contract.module').then( m => m.PreviewContractPageModule)
  },
  {
    path: 'list-contracts',
    loadChildren: () => import('./pages/list-contracts/list-contracts.module').then( m => m.ListContractsPageModule)
  },

  {
    path: 'dashboard',
    // loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)\
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },

  {
    path: 'view-individual-listing/:propertyID',
    loadChildren: () => import('./pages/view-individual-listing/view-individual-listing.module').then( m => m.ViewIndividualListingPageModule)
  },

  // {
  //   path: 'profile',
  //   loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  
  // },

  {
    path: 'property-favorites',
    loadChildren: () => import('./pages/property-favorites/property-favorites.module').then( m => m.PropertyFavoritesPageModule)
  },

  {
    path: 'my-listing',
    loadChildren: () => import('./pages/my-listing/my-listing.module').then( m => m.MyListingPageModule)
  },

 
  {
    path: 'approve-contract',
    loadChildren: () => import('./pages/approve-contract/approve-contract.module').then( m => m.ApproveContractPageModule)
  },

  {
    path: 'addlisting',
    loadChildren: () => import('./pages/addlisting/addlisting.module').then( m => m.AddlistingPageModule)
  },

  {
    path: 'preview-lease-request',
    loadChildren: () => import('./pages/preview-lease-request/preview-lease-request.module').then( m => m.PreviewLeaseRequestPageModule)
  },
  {
    path: 'chatroom',
    loadChildren: () => import('./pages/chatroom/chatroom.module').then( m => m.ChatroomPageModule)
  },

  // {
  //   path: 'list-of-messages',
  //   loadChildren: () => import('./pages/list-of-messages/list-of-messages.module').then( m => m.ListOfMessagesPageModule)
  // },

  {
    path: 'changepassword',
    loadChildren: () => import('./pages/changepassword/changepassword.module').then( m => m.ChangepasswordPageModule)
  },
  {
    path: 'viewmylistingproperty/:propertyID',
    loadChildren: () => import('./pages/viewmylistingproperty/viewmylistingproperty.module').then( m => m.ViewmylistingpropertyPageModule)
  },
  {
    path: 'getaddress',
    loadChildren: () => import('./pages/getaddress/getaddress.module').then( m => m.GetaddressPageModule)
  },
  {
    path: 'getpropertyaddress',
    loadChildren: () => import('./pages/getpropertyaddress/getpropertyaddress.module').then( m => m.GetpropertyaddressPageModule)
  },
  {
    path: 'loginstart',
    loadChildren: () => import('./pages/loginstart/loginstart.module').then( m => m.LoginstartPageModule)
  },
  {
    path: 'signupstart',
    loadChildren: () => import('./pages/signupstart/signupstart.module').then( m => m.SignupstartPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'transactions',
    loadChildren: () => import('./pages/transactions/transactions.module').then( m => m.TransactionsPageModule)
  },  {
    path: 'payment-successful',
    loadChildren: () => import('./payment-successful/payment-successful.module').then( m => m.PaymentSuccessfulPageModule)
  },




];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
