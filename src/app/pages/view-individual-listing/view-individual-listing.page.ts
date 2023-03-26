import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient, HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-view-individual-listing',
  templateUrl: './view-individual-listing.page.html',
  styleUrls: ['./view-individual-listing.page.scss'],
})
export class ViewIndividualListingPage implements OnInit {

  leasingID = '';
  constructor(private http: HttpClient, private navCtrl: NavController) { }

  ngOnInit() {
  }

  async contact(){
    //get data from property table
    const field = {
      'lessorID' : 'c67c549b0387359aac14b0320d92e065',
      'lesseeID' : 'd16e7a3af1f73d2ab70286f9511c6360',
      'propertyID' : '1235',
      'leasing_status' : 'inquiring'
    }


    try {
      const response: HttpResponse<any> = await this.http.post('http://192.168.1.2:5000/leasing', field, { observe: 'response' }).toPromise();
      if(response.status === 201){
        console.log(response);
        console.log(response.body.leasingID);
        this.leasingID = response.body.leasingID;
      } else {

      }
    } catch (error) {
      console.log(error);
      // Handle the error
    }

    const data = {
      'leasingID' : this.leasingID
    }
    
    this.navCtrl.navigateForward('set-contract', { queryParams: { data } });



  }

}
