import { Component, OnInit } from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';
@Component({
  selector: 'app-payment-successful',
  templateUrl: './payment-successful.page.html',
  styleUrls: ['./payment-successful.page.scss'],
})
export class PaymentSuccessfulPage implements OnInit {


  constructor(private webview: WebView) {
    // const url = 'https://app-sandbox.nextpay.world/#/pl/DAJ9fSuaX';
    // const webViewUrl = this.webview.convertFileSrc(url);
  }



  paymentLink: string = 'https://app-sandbox.nextpay.world/#/pl/DAJ9fSuaX';
  
  

  ngOnInit(): void {
    
  }

  


}
