import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.page.html',
  styleUrls: ['./payment-form.page.scss'],
})
export class PaymentFormPage implements OnInit {
  purpose = ''

  constructor(private http: HttpClient) { }

  ngOnInit() {
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

}
