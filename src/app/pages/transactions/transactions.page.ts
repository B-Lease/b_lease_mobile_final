import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/shared/session.service';
import { environment } from 'src/environments/environment';
import { Browser, BrowserPlugin } from '@capacitor/browser';
import { NavController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  userID:any
  response:any
  apiURL = environment.API_URL


  constructor(private http: HttpClient,
    private router: Router,
    private session:SessionService,
    private navCtrl: NavController,
    private inAppBrowser: InAppBrowser,
    private alertController:AlertController
    ) { }

  ngOnInit() {
  }



  async ionViewDidEnter(){
    this.userID = await this.session.getUserID()
    console.log(this.userID)
    this.makeGetRequest()

  }
  
  async makeGetRequest() {

    const apiUrl = `${this.apiURL}pay?userID=${this.userID}`
    this.http.get(apiUrl).subscribe(data => {
      if (typeof data === 'string') {
        this.response = JSON.parse(data);
        console.log(this.response)
      } else {
        this.response = Object.values(data);
      }
    });
  }

  async createPaymentLink(pay_fee:number, paymentID: string) {
    const currentTimestamp = new Date().getTime();

    let transact_fee = Number((pay_fee * 0.022).toFixed(2));
    let total_fee = Number(pay_fee) + transact_fee + 5

    const apiUrl = `${this.apiURL}payLinks`;
    const formData = {
      "title": "B-Lessee Payment",
      "amount": total_fee,
      "currency": "PHP",
      "description": "This is a payment to the lessor.",
      "private_notes": "string",
      "limit": 1,
      "nonce": currentTimestamp
    }


  
    try {
      const response: HttpResponse<any> = await this.http.post(apiUrl, formData, { observe: 'response' }).toPromise();
      if(response.status === 201){
        console.log(response)
        const url = response.body.url
        const id = response.body.id

        const data = {
          npPaymentID: id,
          paymentID: paymentID
        }

        this.openBrowser(url, data)


      } else {

      }
    } catch (error) {
      console.log(error);
      // Handle the error
    }


  }

  async openBrowser(url:string, data:any) {

    await Browser.open({url: url})
    Browser.addListener('browserFinished', () => {
      console.log(data)
      // this.navCtrl.navigateForward(['/payment-successful'], { queryParams: { data } });
      
    })
  }
  


  
  async showAlert(message:string, header:string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: '',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  

  // async getLink() {
  //   const paymentID = await this.activatedroute.snapshot.queryParams['data']['paymentID'];
  //   const npPaymentID = await this.activatedroute.snapshot.queryParams['data']['npPaymentID'];
  //   console.log('payment IDDD')
  //   const apiUrl = `${this.apiURL}payLinks?paymentID=${npPaymentID}`
  //   this.http.get(apiUrl).subscribe(async (data) => {
  //     if (typeof data === 'string') {
  //       this.response = JSON.parse(data);
  //       console.log(this.response)
  //     } else {
  //       this.response = Object.values(data);
  //       console.log(this.response)
  //       console.log('payments_count')
  //       this.payments_count = this.response['9']
  
  //       if (this.payments_count > 0){
  //         this.message = "Paid successfully!";
  //         await this.updatePaymentStatus(paymentID);
         
  //         //await this.getLink();
  //       } else {
  //         this.message = "Payment failed! Please try again.";
   
  //       }
  //     }
  //   });
  // }
  



}

