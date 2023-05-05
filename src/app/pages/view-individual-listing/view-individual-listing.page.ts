import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { LoadingService } from 'src/app/shared/loading.service';
import { Router,ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/shared/session.service';
import * as L from 'leaflet';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';
import axios from 'axios';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-view-individual-listing',
  templateUrl: './view-individual-listing.page.html',
  styleUrls: ['./view-individual-listing.page.scss'],
})
export class ViewIndividualListingPage implements OnInit {
  private sessionID;
  private userID;
  API_URL = environment.API_URL
  IMAGES_URL = this.API_URL+'propertyimages/'
  propertyID:any;
  propertyData: any[] = [];
  propertyFeedbackData:any;
  totalFeedback:any;
  userData: any;
  averageRating:any;
  favorite_propertyIDs:any[] = [];
  private viewIndividualListingMap: L.Map;
  private marker: L.Marker;


  user_fname:any;
  user_mname:any;
  user_lname:any;
  lat:number;
  lng:number;
  
  hasOngoing = 'Contact';
  createLeaseRecord = false;
  response: any[];
  leasingID = ''

  isOwner = false;
  
  constructor(
    private router:Router,
    private session:SessionService,
    private http:HttpClient,
    private loading:LoadingService,
    private route: ActivatedRoute,
    private navCtrl:NavController,
    private toastCtrl:ToastController
    
    
  ) { 
  }

  async ngOnInit() {

    await this.session.init();
    await this.getSessionData();
    
    await this.getPropertyFavoriteIDs();
    await this.route.params.subscribe(params => {
      this.propertyID = params['propertyID'];
    });

    await this.getPropertyListings();
    await this.getPropertyFeedbacks();

    await this.getTotalPropertyFeedbacks();
    await this.getAverageRating();
    //await this.getProfileInfo();

  }

  async ionViewWillEnter(){
    
  }

  async checkExisting() {
    const lesseeID = await this.session.getUserID()
    const lessorID = this.propertyData['userID']
    const propertyID = this.propertyID

    if (lesseeID == lessorID){
      this.isOwner = true
    }

    else {
      this.http.get(`${this.API_URL}leasing?check_existing=yes&lesseeID=${lesseeID}&lessorID=${lessorID}&propertyID=${propertyID}`).subscribe((data) => {
        if (typeof data === 'string') {
          this.response = JSON.parse(data);
          console.log(this.response)
          this.leasingID = this.response[0].leasingID
          this.hasOngoing = 'Chat'
        } else {
          this.response = Object.values(data);
          console.log(this.response)
          this.hasOngoing = 'Contact'
        }
      });
    }


  }
  
  async setupMap(){
    this.viewIndividualListingMap = await L.map('mapId').setView([this.propertyData['latitude'], this.propertyData['longitude']], 18);

    this.viewIndividualListingMap.zoomControl.remove();
    if (L.Browser.retina) {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 20,
        tileSize: 512,
        zoomOffset: -1,
        detectRetina: true
      }).addTo(this.viewIndividualListingMap);
    } else {
      L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(this.viewIndividualListingMap);
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
      this.marker = L.marker([this.propertyData['latitude'], this.propertyData['longitude']], { icon: customIcon }).addTo(this.viewIndividualListingMap);
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

 async getPropertyListings(){
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept':'application/json'
      
    }),
  };

  // this.http.get(this.API_URL+"property?userID="+this.userID+"&sessionID="+this.sessionID+"&propertyID="+this.propertyID, httpOptions).subscribe((data: any[]) => {
  //   this.propertyData = data;
  //   console.log(this.propertyData);
  //   console.log('hi, this is lessorID: '+this.propertyData['userID'])
  // });

  this.http.get(this.API_URL+"property?userID="+this.userID+"&sessionID="+this.sessionID+"&propertyID="+this.propertyID, httpOptions).subscribe((data: any[]) => {
    if(data != null){
      this.propertyData = data;
      console.log(this.propertyData);
      this.checkExisting()
      this.setupMap()
    } else {
      console.log('Error: No property data found');
    }
  }, error => {
      console.log('Error fetching property data: ', error);
  });
 }

 public async getProfileInfo() {
  try {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const data = await this.http.get(this.API_URL + 'user?userID=' + this.userID, { headers }).toPromise();


    
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
  this.navCtrl.navigateRoot(['/home/dashboard']);
}

async createChat(){
    const params = {
      lesseeID: await this.session.getUserID(),
      lessorID: this.propertyData['userID'],
      propertyID: this.propertyID,
      leasing_status: 'inquiring'
    };

    if(this.hasOngoing == 'Contact'){

      try {
        const response: HttpResponse<any> = await this.http.post( environment.API_URL+ 'leasing', params, { observe: 'response' }).toPromise();
        if(response.status === 201){
          const data = {
            leasingID : response.body.leasingID,
            userID: params.lesseeID,
            lesseeID: params.lesseeID,
            lessorID: params.lessorID,
            msg_senderID: params.lesseeID,
            msg_receiverID : params.lessorID
          }
      
          console.log("Generating greeting message");
          const currentDateTime: string = this.getCurrentDateTime();
          var message = environment.greeting_message;
          await this.saveMessage(response.body.leasingID, message, params.lesseeID, params.lessorID, currentDateTime);
  
          // this.router.navigate([`/chatroom/${this.leasingID}/${params.lesseeID}/${params.lesseeID}/${params.lessorID}/${params.lesseeID}/${params.lessorID}`]);
          this.navCtrl.navigateForward('chatroom', { queryParams: { data } });
        } else {

        }
      } catch (error) {
        console.log(error);
        // Handle the error
      }

    } else {
      // const data = {
      //   leasingID : this.leasingID,
      //   userID: params.lesseeID,
      //   lesseeID: params.lesseeID,
      //   lessorID: params.lessorID,
      //   msg_senderID: params.lesseeID,
      //   msg_receiverID : params.lessorID,
      // }

  
      this.router.navigate([`/chatroom/${this.leasingID}/${params.lesseeID}/${params.lesseeID}/${params.lessorID}/${params.lesseeID}/${params.lessorID}`]);
      // this.navCtrl.navigateForward('chatroom', { queryParams: { data } });

    }

    
  }

  async ngOnDestroy() {
    if (this.viewIndividualListingMap) {
      await this.viewIndividualListingMap.remove();
    }
  }

  async getPropertyFeedbacks(){
    
      await axios.get(`${environment.API_URL}feedback?propertyID=${this.propertyID}&sessionID=${this.sessionID}`)
      .then(response => {
        console.log(response.data);
        this.propertyFeedbackData = JSON.parse(response.data.toString());
        console.log(this.propertyFeedbackData);
        // handle the response data here
      })
      .catch(error => {
        console.error(error);
        // handle the error here
      });
  }
  async getTotalPropertyFeedbacks(){
    
      await axios.get(`${environment.API_URL}countfeedback?propertyID=${this.propertyID}&sessionID=${this.sessionID}`)
      .then(response => {
        console.log(response.data['COUNT(*)']);
        this.totalFeedback = response.data['COUNT(*)'];

        if(this.totalFeedback == null)
        {
          this.totalFeedback = 0;
        }

        // console.log(this.totalFeedback);
        // handle the response data here
      })
      .catch(error => {
        console.error(error);
        // handle the error here
      });
  }
  
  async getAverageRating(){
    
      await axios.get(`${environment.API_URL}countrating?propertyID=${this.propertyID}&sessionID=${this.sessionID}`)
      .then(response => {
        console.log(response.data['average_rating']);
        this.averageRating = response.data['average_rating'];

        if(this.totalFeedback == null)
        {
          this.averageRating = 0;
        }

        // console.log(this.totalFeedback);
        // handle the response data here
      })
      .catch(error => {
        console.error(error);
        // handle the error here
      });
  }


  async saveMessage(leasingID: string, message: string, msg_senderID: string, msg_receiverID: string, currentDateTime: string) {
    const body = { 
      'leasingID': leasingID,
      'msg_content': message,  
      'msg_senderID': msg_senderID, 
      'msg_receiverID': msg_receiverID,
      'sent_at': currentDateTime
    };

    try {
      const response: HttpResponse<any> = await this.http.post(environment.API_URL+'messages', body, { observe: 'response' }).toPromise();
      if(response.status === 201){
        console.log(response)
      } else {
      }
    } catch (error) {
      console.log(error);
      // Handle the error
    }
  }
  

  getCurrentDateTime(): string {
    const currentDate = new Date();
  
    const year = currentDate.getFullYear().toString().padStart(4, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  

  async getPropertyFavoriteIDs(){
    await axios.get(`${environment.API_URL}propertyFavorites?sessionID=${this.sessionID}&userID=${this.userID}`)
    .then(response => {
    console.log(response.data);
    this.favorite_propertyIDs = response.data.favorite_propertyIDs;
    console.log(this.favorite_propertyIDs);
    // handle the response data here
    
    })
    .catch(error => {
    console.error(error);
    // handle the error here
    });
    }

    async actionFavorites(propertyID:string){
      console.log(propertyID);


      if(this.favorite_propertyIDs?.includes(propertyID))
      {
        axios.delete(environment.API_URL+`favorites?propertyID=${propertyID}&userID=${this.userID}&sessionID=${this.sessionID}`)
        .then(response => {
          console.log('Property removed from favorites');
          this.showToast("Property removed from favorites");
          this.getPropertyFavoriteIDs();
        })
        .catch(error => {
          console.error('Error:', error);
        });
       
      }
      else{


        const data = {
          userID: this.userID,
          propertyID:propertyID,
          sessionID:this.sessionID
        };

        axios.post(environment.API_URL+'favorites', data)
        .then(response => {
          console.log(response);
          this.showToast("Property added to favorites");
          this.getPropertyFavoriteIDs();

          
        })
        .catch(error => {
          console.log(error);

        });

               }
  
 }
    
  
 async showToast(msg){
  let toast = await this.toastCtrl.create({
    message: msg,
    duration: 2000

  });
  toast.present();
}

}
