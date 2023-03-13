import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { LoadingService } from 'src/app/shared/loading.service';
import { Router,ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-viewmylistingproperty',
  templateUrl: './viewmylistingproperty.page.html',
  styleUrls: ['./viewmylistingproperty.page.scss'],
})
export class ViewmylistingpropertyPage implements OnInit {
  private sessionID;
  private userID;
  API_URL = 'http://192.168.1.2:5000/property'
  IMAGES_URL = 'http://192.168.1.2:5000/propertyimages/'
  propertyID:any;
  propertyData: any[] = [];
  constructor(
    private router:Router,
    private session:SessionService,
    private http:HttpClient,
    private loading:LoadingService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    await this.session.init();
    await this.getSessionData();
    await this.route.params.subscribe(params => {
      this.propertyID = params['propertyID'];
    });

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

  this.http.get(this.API_URL+"?userID="+this.userID+"&sessionID="+this.sessionID+"&propertyID="+this.propertyID, httpOptions).subscribe((data: any[]) => {
    this.propertyData = data;
    console.log(this.propertyData);
  });
 }

}
