import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SessionService } from 'src/app/shared/session.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { LoadingService } from 'src/app/shared/loading.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-list-contracts',
  templateUrl: './list-contracts.page.html',
  styleUrls: ['./list-contracts.page.scss'],
})
export class ListContractsPage implements OnInit {
  API_URL = environment.API_URL+'leasingcontracts'
  IMAGE_API_URL = environment.API_URL+'propertyimages/'
  sessionID:any;
  userID:any;
  data:any[] = [];
  leasingData:any[] = [];
  filter = "all";
  
  
  constructor(
    private navCtrl:NavController,
    private session:SessionService,
    private http:HttpClient,
    private loading:LoadingService,
    
  ) { }

  async handleRefresh(event) {
  
      // Any calls to load data go here
      this.leasingData = [];
      await this.refreshPropertyListings();
      await event.target.complete();

  };

  ngOnInit() {
  }

  navigateProfile(){
    this.navCtrl.navigateBack(['/home/userprofile']);
  }

  async getSessionData(){
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : '+sessionID_data);
    console.log('USER ID : '+userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;
 }

 async getPropertyListings(){
  await this.loading.present('Loading Contracts');
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept':'application/json'
      
    }),
  };

  await this.http.get(this.API_URL+"?userID="+this.userID, httpOptions).subscribe((data: any[]) => {
    this.data = JSON.parse(data.toString());
    console.log(data);
    this.loading.dismiss();
    
    this.leasingData = [];

    if(this.filter === 'all')
    {
      for (let i = 0; i<this.data.length;i++){
        this.leasingData.push(this.data[i]);
      }  
    }
    if(this.filter === 'ongoing')
    {
      for (let i = 0; i<this.data.length;i++){
        if (this.data[i].leasing_status == 'open')
        {
          this.leasingData.push(this.data[i])
        }
      }
    }
    if(this.filter === 'pending')
    {
      for (let i = 0; i<this.data.length;i++){
        if (this.data[i].leasing_status == 'pending')
        {
          this.leasingData.push(this.data[i])
        }
      }
    }
    if(this.filter === 'finished')
    {
      for (let i = 0; i<this.data.length;i++){
        if (this.data[i].leasing_status == 'finished')
        {
          this.leasingData.push(this.data[i])
        }
      }
    }
  });
 }
 async refreshPropertyListings(){
  await this.loading.present('Loading Contracts');
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept':'application/json'
      
    }),
  };

  await this.http.get(this.API_URL+"?userID="+this.userID, httpOptions).subscribe((data: any[]) => {
    console.log(data);
    this.data = JSON.parse(data.toString());
    this.loading.dismiss();
    
    this.leasingData = [];
    
    if(this.filter == 'all')
    {

      for (let i = 0; i<this.data.length;i++){
        this.leasingData.push(this.data[i]);
      }
      
    }
    if(this.filter == 'ongoing')
    {
  
      for (let i = 0; i<this.data.length;i++){
        if (this.data[i].leasing_status == 'open')
        {
          this.leasingData.push(this.data[i])
        }
      }
  
    }
    if(this.filter == 'pending')
    {
     
      for (let i = 0; i<this.data.length;i++){
        if (this.data[i].leasing_status == 'pending')
        {
          this.leasingData.push(this.data[i])
        }
      }
    }
    if(this.filter == 'finished')
    {
  
      for (let i = 0; i<this.data.length;i++){
        if (this.data[i].leasing_status == 'finished')
        {
          this.leasingData.push(this.data[i])
        }
      }
    }
  });
 }

 async ionViewWillEnter(){
  await this.session.init();
  await this.getSessionData();
  await this.getPropertyListings();
}

getFilter(event: Event) {
  this.filter = (event as CustomEvent<any>).detail.value;
  this.getPropertyListings();
  
}
 viewContract(leasingID:string,propertyID:string, propertyImage:string){
  console.log(propertyID);
  var address = "";
  for (let i = 0; i<this.leasingData.length;i++){

    if (this.leasingData[i].leasingID == leasingID)
    {
      
      this.navCtrl.navigateForward(['/preview-contract',
      {
        leasingID:leasingID,
        propertyID:propertyID,
        address: this.leasingData[i].address,
        propertyImage:propertyImage
      }
    ]);
    }
  }

}





}
