import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {

  apiURL = environment.API_URL
  constructor(private http: HttpClient,
    private router: Router
    ) { }

  ngOnInit() {
  }

  async makeGetRequest() {
    const apiUrl = `${this.apiURL}getLinks?paymentID=sm268srg12u1q99udareru3m`

    this.http.get(apiUrl).subscribe(response => {
      console.log(response);
      this.router.navigate(['/payment-successful'])
    });
  }

}
