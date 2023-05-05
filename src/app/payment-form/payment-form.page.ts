import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import axios from 'axios';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.page.html',
  styleUrls: ['./payment-form.page.scss'],
})
export class PaymentFormPage implements OnInit {
  purpose = ''
  paymentIntentStatus: string;
  paymentIntentNextActionUrl: string;
  safeUrl:any;

  
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.makePayment();
  }

  onSubmit(){
    const url = 'https://api.paymongo.com/v1/payment_intents';
    const body = {
      data: {
        attributes: {
          amount: 10000,
          payment_method_allowed: ['paymaya','gcash'],
          payment_method_options: {card: {request_three_d_secure: 'any'}},
          currency: 'PHP',
          capture_type: 'automatic'
        }
      }
    };

    const headers = new HttpHeaders({
      'accept': 'application/json',
      'content-type': 'application/json',
      'authorization': 'Basic c2tfdGVzdF9Sb2tNM0NkZ2pEYXEyclFtYWkzSERTSFA6'
    });

    this.http.post(url, body, { headers })
      .subscribe(
        response => console.log(response),
        error => console.error(error)
      );
  }

  // async presentModal() {
  //   const modal = await this.modalController.create({
  //     component: PaymentFormPage,
  //     componentProps: {
  //       url: 'https://example.com'
  //     }
  //   });
  //   return await modal.present();
  // }

  // createPaymentIntent(){
  //   const options = {
  //     method: 'POST',
  //     headers: {accept: 'application/json', 'content-type': 'application/json'},
  //     body: JSON.stringify({
  //       data: {
  //         attributes: {
  //           amount: 10000,
  //           payment_method_allowed: ['atome', 'card', 'dob', 'paymaya', 'billease', 'gcash', 'grab_pay'],
  //           payment_method_options: {card: {request_three_d_secure: 'any'}},
  //           currency: 'PHP',
  //           capture_type: 'automatic'
  //         }
  //       }
  //     })
  //   };
    
  //   fetch('https://api.paymongo.com/v1/payment_intents', options)
  //     .then(response => response.json())
  //     .then(response => console.log(response))
  //     .catch(err => console.error(err));
  // }

  // createPaymentMethod(){
  //   const options = {
  //     method: 'POST',
  //     headers: {accept: 'application/json', 'Content-Type': 'application/json'}
  //   };
    
  //   fetch('https://api.paymongo.com/v1/payment_methods', options)
  //     .then(response => response.json())
  //     .then(response => console.log(response))
  //     .catch(err => console.error(err));
  // }

  makePayment(){
  //   // This PaymentMethod ID must be created before the attach action. This is just a sample value to represent a PaymentMethod
  //   const paymentMethodId = 'pm_9PjTrzm8NEh7VcusBFNK5H8q';
    
  //   // PaymentIntent client_key example
  //   const clientKey = 'pi_qiUBvqdY7zPE9Qm5rF2frWVn_client_2wNQxG4fRt4EC5nEkwGqvxsv';
    
  //   // Get the payment intent id from the client key
  //   const paymentIntentId = 'pi_qiUBvqdY7zPE9Qm5rF2frWVn';
    
  //   axios.get(
  //     // `https://api.paymongo.com/v1/payment_intents/${paymentIntentId}/attach`,
  //     // {
  //     //   data: {
  //     //     attributes: {
  //     //       client_key: clientKey,
  //     //       payment_method: paymentMethodId,
  //     //       return_url: "http://localhost:8100/dashboard/transactions"
  //     //     }
  //     //   }
  //     // },
  //     // `${environment.API_URL}paymentintent/get`
  //     'https://api.paymongo.com/v1/payment_intents/pi_MAFrkpq6LDF9PmdN6BpkYZZ7',
  //     {
  //       headers: {
  //         // Base64 encoded public PayMongo API key.
  //         Authorization: `Basic c2tfdGVzdF9Sb2tNM0NkZ2pEYXEyclFtYWkzSERTSFA6`
  //       }
  //     }
  //   ).then((response) => {
  //     console.log(response)
  //     const paymentIntent = response.data.data;
  //     console.log(paymentIntent)
  //     this.paymentIntentStatus = paymentIntent.attributes.status;
  //     console.log(this.paymentIntentStatus)
    
  //     if (this.paymentIntentStatus === 'awaiting_next_action') {
  //       console.log('BAYRONON PA')
  //       // Render your modal for 3D Secure Authentication since next_action has a value. You can access the next action via paymentIntent.attributes.next_action.
  //       const iframeUrl = paymentIntent.attributes.next_action.redirect.url;
  //       const modal = document.createElement('div');
  //       modal.classList.add('modal');
  //       const modalContent = document.createElement('div');
  //       modalContent.classList.add('modal-content');
  //       const iframe = document.createElement('iframe');
  //       iframe.src = iframeUrl;
  //       modalContent.appendChild(iframe);
  //       modal.appendChild(modalContent);
  //       document.body.appendChild(modal);

  //       // this.paymentIntentNextActionUrl = paymentIntent.attributes.next_action.redirect.url;
  //       // this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.paymentIntentNextActionUrl);
  //       // console.log(this.paymentIntentNextActionUrl)
  //     } else if (this.paymentIntentStatus === 'succeeded') {
  //       // You already received your customer's payment. You can show a success message from this condition.
  //     } else if (this.paymentIntentStatus === 'awaiting_payment_method') {
  //       // The PaymentIntent encountered a processing error. You can refer to paymentIntent.attributes.last_payment_error to check the error and render the appropriate error message.
  //     } else if (this.paymentIntentStatus === 'processing') {
  //       // You need to requery the PaymentIntent after a second or two. This is a transitory status and should resolve to `succeeded` or `awaiting_payment_method` quickly.
  //     }
  //   });
  }
  

}
