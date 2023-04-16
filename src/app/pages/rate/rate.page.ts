import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/shared/session.service';

import { LoadingService } from 'src/app/shared/loading.service';

import { ToastController, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';
import { NavController } from '@ionic/angular';
import axios from 'axios';
import { Router } from '@angular/router';
@Component({
  selector: 'app-rate',
  templateUrl: './rate.page.html',
  styleUrls: ['./rate.page.scss'],
})
export class RatePage implements OnInit {
  userID:any;
  sessionID:any;
  propertyID:any;
  address:any;
  propertyImage:any;
  leasingID:any;
  IMAGE_API_URL = environment.API_URL+'propertyimages/';


  rating:number = 0;
  review:string = "";
  // Rating Star Variables
  star1:boolean = false;
  star2:boolean = false;
  star3:boolean = false;
  star4:boolean = false;
  star5:boolean = false;

  constructor(
    private activatedroute:ActivatedRoute,
    private session:SessionService,
    private navCtrl:NavController,
    private toastController:ToastController,
    private loading:LoadingService,
    private alertController:AlertController,
    private router:Router
  ) { }

  async ngOnInit() {
    await this.session.init();
    await this.getSessionData();


    this.address = this.activatedroute.snapshot.paramMap.get('address');
    this.propertyID = this.activatedroute.snapshot.paramMap.get('propertyID');
    this.propertyImage = this.activatedroute.snapshot.paramMap.get('propertyImage');
    this.leasingID = this.activatedroute.snapshot.paramMap.get('leasingID');
  
  }


  async getSessionData() {
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : ' + sessionID_data);
    console.log('USER ID : ' + userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;
  }

   navigatePreviewContract(){
    this.navCtrl.navigateForward(['/preview-contract',
    {
   
      leasingID:this.leasingID,
        propertyID:this.propertyID,
        address: this.address,
        propertyImage:this.propertyImage
    }
  ]);
   }

   setRating(rate:number)
   {
      this.rating = rate;

      if(rate == 1)
      {
        this.star1 = true;
        this.star2 = false;
        this.star3 = false;
        this.star4 = false;
        this.star5 = false;
      }
      if(rate == 2)
      {
        this.star1 = true;
        this.star2 = true;
        this.star3 = false;
        this.star4 = false;
        this.star5 = false;
      }
      if(rate == 3)
      {
        this.star1 = true;
        this.star2 = true;
        this.star3 = true;
        this.star4 = false;
        this.star5 = false;
      }
      if(rate == 4)
      {
        this.star1 = true;
        this.star2 = true;
        this.star3 = true;
        this.star4 = true;
        this.star5 = false;
      }
      if(rate == 5)
      {
        this.star1 = true;
        this.star2 = true;
        this.star3 = true;
        this.star4 = true;
        this.star5 = true;
      }
   }


   async onSubmit(){
        if(this.rating != 0 && this.review != "")
        {
          // # userID
          // # propertyID
          // # feedback_rating
          // # feedback_content
          // sessionID
            this.loading.present("Submitting Feedback");
            // Define a data object to send in the POST request
          const data = {
            userID: this.userID,
            propertyID:this.propertyID,
            feedback_rating:this.rating,
            feedback_content:this.review,
            sessionID:this.sessionID
          };

          axios.post(environment.API_URL+'feedback', data)
          .then(response => {
            console.log(response);
            this.loading.dismiss();
            this.successAlert();
            // Handle success response here
          })
          .catch(error => {
            console.log(error);
            this.loading.dismiss();
            // Handle error response here
          });
         
        }
        else{
          if(this.rating == 0 && this.review != "")
          {
            //rating alert here
            this.rateToast();
          }
          if(this.review == "" && this.rating != 0)
          {
            this.reviewToast();
          }
          else{
            this.incompleteToast();
          }
        }
   }

   async rateToast() {
    const toast = await this.toastController.create({
      message: 'Please provide a rating',
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }
   async reviewToast() {
    const toast = await this.toastController.create({
      message: 'Please provide a review',
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }
   async incompleteToast() {
    const toast = await this.toastController.create({
      message: 'Please fill in all the fields',
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }

  async successAlert() {
    const alert = await this.alertController.create({
      header: 'Property Feedback',
      subHeader: 'Success!',
      message: 'Thank you for providing your feedback',
      buttons: [{
        text:'OK',
        handler: () =>{
          this.router.navigate(['/home']);
        }
      }],
   
    });

    await alert.present();
  }




}
