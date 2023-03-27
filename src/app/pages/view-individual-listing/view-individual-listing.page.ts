import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { LoadingService } from 'src/app/shared/loading.service';
import { Router,ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/shared/session.service';
import * as L from 'leaflet';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-view-individual-listing',
  templateUrl: './view-individual-listing.page.html',
  styleUrls: ['./view-individual-listing.page.scss'],
})
export class ViewIndividualListingPage implements OnInit {
  private sessionID;
  private userID;
  API_URL = 'http://192.168.1.2:5000/property'
  IMAGES_URL = 'http://192.168.1.2:5000/propertyimages/'
  propertyID:any;
  propertyData: any[] = [];
  userData: any;
  private addpropertyMap: L.Map;
  private marker: L.Marker;


  user_fname:any;
  user_mname:any;
  user_lname:any;
  lat:number;
  lng:number;
  constructor(
    private router:Router,
    private session:SessionService,
    private http:HttpClient,
    private loading:LoadingService,
    private route: ActivatedRoute,
    private navCtrl:NavController

    
  ) { }

  async ngOnInit() {

    await this.session.init();
    await this.getSessionData();
    await this.route.params.subscribe(params => {
      this.propertyID = params['propertyID'];
    });

    await this.getPropertyListings();
    await this.getProfileInfo();
    await this.setupMap();
   
  }

  async ionViewWillEnter(){

  }
  async setupMap(){
    this.addpropertyMap = await L.map('mapId').setView([this.propertyData['latitude'], this.propertyData['longitude']], 18);

    this.addpropertyMap.zoomControl.remove();
    if (L.Browser.retina) {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 20,
        tileSize: 512,
        zoomOffset: -1,
        detectRetina: true
      }).addTo(this.addpropertyMap);
    } else {
      L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(this.addpropertyMap);
    }

    const customIcon = L.icon({
      iconUrl: 'assets/icon/b_lease_marker.svg',
      // shadowUrl: 'assets/icon/b_lease_marker-shadow.png',
      iconSize: [25, 41],
      // shadowSize: [35, 41],
      iconAnchor: [12, 41],
      // shadowAnchor: [12, 41],
      popupAnchor: [0, -35],
    });

    if (this.lat != 0 && this.lng != 0) {
      this.marker = L.marker([this.propertyData['latitude'], this.propertyData['longitude']], { icon: customIcon }).addTo(this.addpropertyMap);
    }
  
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

 public async getProfileInfo() {
  try {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const data = await this.http.get('http://192.168.1.2:5000' + '/user?userID=' + this.userID, { headers }).toPromise();


    
    this.userData = JSON.parse(data.toString());
    console.log(this.userData);

    this.user_fname = this.userData.user_fname;
    this.user_mname = this.userData.user_mname;
    this.user_lname = this.userData.user_lname;


    this.userData.user_img = this.userData.user_img === null?"assets/icon/user.svg":this.userData.user_img;
  } catch (error) {
    console.error(error);
  }
}

navigateDashboard(){
  this.navCtrl.navigateBack(['/home/dashboard']);
}
}
