import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Router,ActivatedRoute } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core';
import { NavController } from '@ionic/angular';
import { SessionService } from 'src/app/shared/session.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { ToastController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;
  propertyData: any[] = [];
  private sessionID;
  private userID;
  public dataLoaded = false;
  searchQuery:string = "";
  favorite_propertyIDs:any[] = [];
  // private  sessionData = [];
  

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  
  constructor(
    public navCtrl: NavController,
    private activatedroute:ActivatedRoute,
    private router:Router,
    private session:SessionService,
    private http:HttpClient,
    private toastCtrl:ToastController
    
    ) { 
      // this.loadSession();
    this.navCtrl.navigateForward('/dashboard', { animated: false });
    
  }
  IMAGES_URL = environment.API_URL+'propertyimages/'
  apiURL = environment.API_URL+'properties';

  // async loadSession(){
  //   // this.sessionData = await this.session.getData();
  //   this.session.getData().subscribe(res =>{
  //     this.sessionData = res;
  //   });
  //   console.log(this.sessionData)
  // }

  // async addSession(sessionID){
  //   await this.session.addData(sessionID);
  //   this.loadSession();
  // }
  // async removeSession(index){
  //   this.session.removeItem(index);
  //   this.sessionData.splice(index,1);
  // }
  async ionViewDidEnter() {
  
  
  }
  
  async ionViewWillEnter(){

  }



  
  async ngOnInit() {
    await this.session.init();
    await this.getSessionData();
    await this.getPropertyListings();

    await this.getPropertyFavoriteIDs();
  }

  getPropertyListings(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept':'application/json'
        
      }),
    };
    if(this.searchQuery != "")
    {
      this.http.get(environment.API_URL+"searchProperty?sessionID="+this.sessionID+"&query="+this.searchQuery, httpOptions).subscribe((data: any[]) => {
        this.propertyData = data;
        console.log(this.propertyData);
        this.dataLoaded = true;
      });
    }
    else{
      this.http.get(this.apiURL+"?sessionID="+this.sessionID, httpOptions).subscribe((data: any[]) => {
        this.propertyData = data;
        console.log(this.propertyData);
        this.dataLoaded = true;
      });
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

async showToast(msg){
  let toast = await this.toastCtrl.create({
    message: msg,
    duration: 2000

  });
  toast.present();
}

async openFavorites()
{


  this.navCtrl.navigateForward("/property-favorites");
}

async onEnter() {
  console.log('Search value:', this.searchQuery);
   await this.getPropertyListings();
}

async onClearSearch() {
  await this.getPropertyListings();
}
}
