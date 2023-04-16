import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/shared/session.service';
import { environment } from 'src/environments/environment';
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
    ) { }

  ngOnInit() {
  }

  async ionViewDidEnter(){
    console.log('enter dira')
    this.userID = await this.session.getUserID()
    console.log(this.userID)
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

}
