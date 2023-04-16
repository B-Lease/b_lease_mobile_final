import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { SessionService } from 'src/app/shared/session.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { LoadingService } from 'src/app/shared/loading.service';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';
import { ActionSheetController } from '@ionic/angular';
import axios from 'axios';
import { AlertController } from '@ionic/angular';
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
    private navCtrl:NavController,
    private actionSheetCtrl: ActionSheetController,
    private alertController:AlertController
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
    this.navCtrl.navigateBack(['/home/userprofile']);
  }

  async presentActionSheet(propertyID) {
 
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Property Action',
      buttons: [
        {
          text: 'Delete this property',
          role: 'destructive',
          icon: 'trash', // Add icon here
          data: {
            action: 'delete',
          },  
          handler: () =>{
              this.deleteProperty(propertyID);
         
          }
        },
        {
          text: 'Edit this property',
          role: 'destructive',
          icon: 'create-outline', // Add icon here
          data: {
            action: 'edit',
          },  
          handler: () =>{
              console.log(propertyID);
              console.log("Edit property");
              this.navigateEditProperty(propertyID);
              
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close-outline',
          data: {
            action: 'cancel',
          },
        },
      ],
    });
  
    await actionSheet.present();
  }
  

  viewIndividualListing(propertyID){
      this.navCtrl.navigateForward(['/viewmylistingproperty/'+propertyID])
  }


    deleteProperty(propertyID)
    {
      this.loading.present('Deleting Property');
      console.log("Property ID: "+propertyID);



      axios.delete(environment.API_URL+ 'property?propertyID='+propertyID+'&userID='+this.userID+'&sessionID='+this.sessionID)
      .then(response => {
        this.loading.dismiss();
        console.log(response.data.message);
      
          this.successAlert();
      
      })
      .catch(error => {
        this.loading.dismiss();
      
        if(error.response.request.status === 403){
            console.log('Ongoing');
            this.errorOngoingAlert();
        }
        else{
          this.errorAlert();
        }
      });
    }

    navigateEditProperty(propertyID){
      this.router.navigate(['/edit-individual-listing',{
        propertyID:propertyID
      
      }]);
  
    }

    async successAlert() {
      const alert = await this.alertController.create({
        header: 'Delete Property Listing',
        subHeader: 'Success!',
        message: 'Your property has been deleted',
        buttons: [{
          text: 'OK',
          handler:() =>{
            console.log('Alert closed');
            this.getPropertyListings();
          }
        }],
      });
  
      await alert.present();
    }
    async errorOngoingAlert() {
      const alert = await this.alertController.create({
        header: 'Delete Property Listing',
        subHeader: 'Cannot Delete',
        message: 'Your property currently has an ongoing transactions',
        buttons: [{
          text: 'OK',
          handler:() =>{
            console.log('Alert closed');
          }
        }],
      });
  
      await alert.present();
    }

    async errorAlert() {
      const alert = await this.alertController.create({
        header: 'Delete Property Listing',
        subHeader: 'Error Delete',
        message: 'There is an error deleting your property. Try again next time',
        buttons: [{
          text: 'OK',
          handler:() =>{
            console.log('Alert closed');
          }
        }],
      });
  
      await alert.present();
    }
  
}
