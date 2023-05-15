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
  isFilterModalOpen:boolean = false;
  propertyData: any[] = [];
  private sessionID;
  private userID;
  public dataLoaded = false;
  searchQuery:string = "  ";
  searchSuggestions:string[];
  favorite_propertyIDs:any[] = [];
  

  // filter variables
  // -------------------------------------------
  filter_minimum_price:number = 0;
  filter_maximum_price:number= 0;
  filter_minimum_property_size:number = 0;
  filter_maximum_property_size:number = 0;
  filter_property_type:string = "any";




  
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

async  handleRefresh(event) {
    await setTimeout(() => {
     
        this.session.init();
       this.getSessionData();
       this.getPropertyListings();
  
       this.getPropertyFavoriteIDs();
      event.target.complete();
    }, 2000);
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
    this.searchSuggestions = null;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept':'application/json'
        
      }),
    };
    if(this.searchQuery != "")
    {
      this.http.get(environment.API_URL+"searchProperty?sessionID="+this.sessionID+"&query="+this.searchQuery+`&min_price=${this.filter_minimum_price}&max_price=${this.filter_maximum_price}&min_property=${this.filter_minimum_property_size}&max_property=${this.filter_maximum_property_size}&property_type=${this.filter_property_type}`, httpOptions).subscribe((data: any[]) => {
        if (data['message'] === 'No search results')
        {
          this.propertyData = [];
          console.log("No search result");
        }
        else{
          this.propertyData = data;
          console.log(this.propertyData);
          this.dataLoaded = true;
        }
    
      });
    }
    else{
      this.http.get(environment.API_URL+"searchProperty?sessionID="+this.sessionID+"&query="+this.searchQuery+`&min_price=${this.filter_minimum_price}&max_price=${this.filter_maximum_price}&min_property=${this.filter_minimum_property_size}&max_property=${this.filter_maximum_property_size}&property_type=${this.filter_property_type}`, httpOptions).subscribe((data: any[]) => {
        if (data['message'] === 'No search results')
        {
          this.propertyData = [];
          console.log("No search result");
        }
        else{
          this.propertyData = data;
          console.log(this.propertyData);
          this.dataLoaded = true;
        }
    
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
  this.searchSuggestions = null;
   await this.getPropertyListings();
}

async onClearSearch() {
  this.searchQuery = "";
  this.searchSuggestions = null;
   this.getPropertyListings();
}

async handleInput(event) {
  this.searchSuggestions = null;
  const query = event.target.value.toLowerCase();
  await axios.get(environment.API_URL+"searchPropertySuggestions?query="+query)
  .then(response => {
    console.log(response.data.data);
    this.searchSuggestions = response.data.data;
    // handle the response data here
  })
  .catch(error => {
    console.error(error);
    // handle the error here
  });
}

async searchThis(result:string)
{
  this.searchSuggestions = null;
  this.searchQuery = result;
  this.getPropertyListings();
}

async setOpenFilterModal(state:boolean){
    this.isFilterModalOpen = state;
}
async confirm_filter(){
  await this.getPropertyListings();
  this.isFilterModalOpen = false;
}

async clearSearchFilter(){
  this.filter_minimum_price = 0;
  this.filter_maximum_price= 0;
  this.filter_minimum_property_size = 0;
  this.filter_maximum_property_size = 0;
  this.filter_property_type = "any";
  this.searchQuery = "";
  this.searchSuggestions = null;
  this.isFilterModalOpen = false;
  this.getPropertyListings();

  
}
}
