import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentSuccessfulPageRoutingModule } from './payment-successful-routing.module';

import { PaymentSuccessfulPage } from './payment-successful.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentSuccessfulPageRoutingModule
  ],
  declarations: [PaymentSuccessfulPage],
  providers: [InAppBrowser]
})
export class PaymentSuccessfulPageModule {}
