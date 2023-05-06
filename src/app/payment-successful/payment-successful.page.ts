import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Browser } from '@capacitor/browser';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../shared/session.service';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-payment-successful',
  templateUrl: './payment-successful.page.html',
  styleUrls: ['./payment-successful.page.scss'],
})
export class PaymentSuccessfulPage implements OnInit {
  apiURL = environment.API_URL
  url: string;
  response:any;
  message: string = "";
  payments_count;
  constructor(private http: HttpClient,
    private activatedroute: ActivatedRoute,
    private session: SessionService,
    private navCtrl: NavController,
    private alertController:AlertController
    ) {}

  async ngOnInit() {
    await this.getLink()
  }

  // async getLink() {
  //   //const userID = await this.session.getUserID()
  //   const paymentID = await this.activatedroute.snapshot.queryParams['data']['paymentID'];
  //   const npPaymentID = await this.activatedroute.snapshot.queryParams['data']['npPaymentID'];
  //   console.log('payment IDDD')
  //   console.log(paymentID)
  //   const apiUrl = `${this.apiURL}payLinks?paymentID=${npPaymentID}`
  //   this.http.get(apiUrl).subscribe(data => {
  //     if (typeof data === 'string') {
  //       this.response = JSON.parse(data);
  //       console.log(this.response)
  //     } else {
  //       this.response = Object.values(data);
  //       console.log(this.response)
  //       console.log('payments_count')
  //       this.payments_count = this.response['9']
  //     }
  //   });

  //   if (this.payments_count > 0){
  //     this.message = "Paid successfully!";
  //     await this.updatePaymentStatus(paymentID);
  //   } else {
  //     this.message = "Payment failed! Please try again.";
  //   }
  // }
  async getLink() {
    const paymentID = await this.activatedroute.snapshot.queryParams['data']['paymentID'];
    const npPaymentID = await this.activatedroute.snapshot.queryParams['data']['npPaymentID'];
    console.log('payment IDDD')
    const apiUrl = `${this.apiURL}payLinks?paymentID=${npPaymentID}`
    this.http.get(apiUrl).subscribe(async (data) => {
      if (typeof data === 'string') {
        this.response = JSON.parse(data);
        console.log(this.response)
      } else {
        this.response = Object.values(data);
        console.log(this.response)
        console.log('payments_count')
        this.payments_count = this.response['9']
  
        if (this.payments_count > 0){
          this.message = "Paid successfully!";
          await this.updatePaymentStatus(paymentID);
         
          //await this.getLink();
        } else {
          this.message = "Payment failed! Please try again.";
   
        }
      }
    });
  }
  

  async updatePaymentStatus(paymentID: string){
    console.log('PAID')
    try {
      const response = await this.http.put(`${this.apiURL}pay?paymentID=${paymentID}`, { observe: 'response' }).toPromise();
      if(response !== undefined){
        console.log(response)

      } else {

      }
    } catch (error) {
      console.log(error);
      // Handle the error
    }
    
  }

  gotoTransactions(){
    this.navCtrl.navigateForward('/transactions')
  }

  // sendRequest() {
  //   this.http.get(`${this.apiURL}pay`, { observe: 'response' }).subscribe(response => {
  //     // Check if the response is a redirect
  //     if (response.status === 302) {
  //       // Redirect to the URL in the Location header
  //       window.location.href = response.headers.get('Location');
  //       console.log(response.headers.get('Location'))
  //     }
  //   }, error => {
  //     console.error(error);
  //   });
  // }



  
}



