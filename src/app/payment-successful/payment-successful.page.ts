import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Browser } from '@capacitor/browser';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-payment-successful',
  templateUrl: './payment-successful.page.html',
  styleUrls: ['./payment-successful.page.scss'],
})
export class PaymentSuccessfulPage implements OnInit {
  apiURL = environment.API_URL
  iframesrc = ''
  iframeUrl: any;
  capacitorUrl = 'https://app-sandbox.nextpay.world/#/pl/NjWAW10p5'
  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private iab: InAppBrowser) {

  }



  ngOnInit(){

  }
 

  openLink() {
    const browser = this.iab.create('https://app-sandbox.nextpay.world/#/pl/NjWAW10p5', '_self', { location: 'no' });
  }


  
}


