import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/shared/session.service';
import { environment } from 'src/environments/environment';
import { Browser, BrowserPlugin } from '@capacitor/browser';
import { NavController } from '@ionic/angular';

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
    private navCtrl: NavController
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

  async createPaymentLink(pay_fee) {
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
        console.log(response.body.url)
        const url = response.body.url
        const paymentID = response.body.id
        this.openBrowser(url, paymentID)

        const data = {
          paymentID: paymentID
        }

        console.log('transactions: '+paymentID)
        this.navCtrl.navigateForward('/payment-successful', { queryParams: { data } });
      } else {

      }
    } catch (error) {
      console.log(error);
      // Handle the error
    }


  }

  async openBrowser(url, paymentID){
    await Browser.open({
      url: url,
      toolbarColor: '#FF0000',
      presentationStyle: 'popover',
    });
  
    // Browser.addListener('browserFinished', () => {
    //   const data = {
    //     paymentID: paymentID
    //   }

    //     console.log('transactions: '+paymentID)
    //     this.navCtrl.navigateForward('/payment-successful', { queryParams: { data } });

    // });




  }

}
