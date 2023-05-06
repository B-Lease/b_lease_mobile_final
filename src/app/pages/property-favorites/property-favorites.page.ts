import { Component, OnInit } from '@angular/core';
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
  selector: 'app-property-favorites',
  templateUrl: './property-favorites.page.html',
  styleUrls: ['./property-favorites.page.scss'],
})
export class PropertyFavoritesPage implements OnInit {
  private sessionID;
  private userID;
  favorite_property:any = null;
  public dataLoaded = false;
  favorite_propertyIDs:any[] = [];
  IMAGES_URL = environment.API_URL+'propertyimages/'
  apiURL = environment.API_URL+'properties';
  constructor(
    public navCtrl: NavController,
    private activatedroute:ActivatedRoute,
    private router:Router,
    private session:SessionService,
    private http:HttpClient,
    private toastCtrl:ToastController

  ) { }

 async ngOnInit() {
  await this.session.init();
  await this.getSessionData();
  await this.getMyPropertyFavorites();

  }

 async ionViewDidEnter(){
 
 }

  async getSessionData(){
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : '+sessionID_data);
    console.log('USER ID : '+userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;


 }

 async getMyPropertyFavorites(){
  await axios.get(`${environment.API_URL}favorites?sessionID=${this.sessionID}&userID=${this.userID}`)
  .then(response => {
    if (response.data.message === "No property favorites")
    {
     this.favorite_property = null;
    }
    else{
      this.favorite_property = response.data;
    }


    
    this.dataLoaded = true;
    // handle the response data here
  })
  .catch(error => {
    console.error(error);
    // handle the error here
  });
 }


 async removeFavorites(propertyID:string){
  console.log(propertyID);

    axios.delete(environment.API_URL+`favorites?propertyID=${propertyID}&userID=${this.userID}&sessionID=${this.sessionID}`)
    .then(response => {
      console.log('Property removed from favorites');
    
      this.showToast("Property removed from favorites");
      
    })
    .catch(error => {
      console.error('Error:', error);
    });
    await this.getPropertyFavoriteIDs();
    await this.getMyPropertyFavorites();


  
  

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

navigateDashboard(){
  this.navCtrl.navigateRoot("/dashboard");
}
}
