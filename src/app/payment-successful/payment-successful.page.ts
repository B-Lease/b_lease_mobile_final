import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Browser } from '@capacitor/browser';


@Component({
  selector: 'app-payment-successful',
  templateUrl: './payment-successful.page.html',
  styleUrls: ['./payment-successful.page.scss'],
})
export class PaymentSuccessfulPage implements OnInit {
  apiURL = environment.API_URL
  url: string;

  constructor(private http: HttpClient) {}

  ngOnInit() {
  }

  sendRequest() {
    this.http.get(`${this.apiURL}pay`, { observe: 'response' }).subscribe(response => {
      // Check if the response is a redirect
      if (response.status === 302) {
        // Redirect to the URL in the Location header
        window.location.href = response.headers.get('Location');
        console.log(response.headers.get('Location'))
      }
    }, error => {
      console.error(error);
    });
  }


  
}



