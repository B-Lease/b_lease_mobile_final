import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/shared/session.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { LoadingService } from 'src/app/shared/loading.service';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-my-listing',
  templateUrl: './my-listing.page.html',
  styleUrls: ['./my-listing.page.scss'],
})
export class MyListingPage implements OnInit {
  private sessionID;
  private userID;
  API_URL = environment.API_URL+'property'
  IMAGES_URL = environment.API_URL+'propertyimages/'
  propertyData: any[] = [];
  constructor(
    private router:Router,
    private session:SessionService,
    private http:HttpClient,
    private loading:LoadingService,
    private navCtrl:NavController
    ) {
      
     }

    async ngOnInit() {


    
    }
    
  
    async ionViewWillEnter(){
      await this.session.init();
      await this.getSessionData();
      await this.getPropertyListings();
    }
  
 

    async getSessionData(){
      let sessionID_data = await this.session.getSessionID();
      let userID_data = await this.session.getUserID();
      console.log('SESSION ID : '+sessionID_data);
      console.log('USER ID : '+userID_data);
      this.sessionID = sessionID_data;
      this.userID = userID_data;
  
  
   }

   getPropertyListings(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept':'application/json'
        
      }),
    };

    this.http.get(this.API_URL+"?userID="+this.userID+"&sessionID="+this.sessionID, httpOptions).subscribe((data: any[]) => {
      this.propertyData = data;
      console.log(this.propertyData);
    });
   }
  
  addListing(){
    this.router.navigate(['/addlisting']);
  }

  navigateProfile(){
    this.navCtrl.navigateBack(['/home/profile']);
  }


}
