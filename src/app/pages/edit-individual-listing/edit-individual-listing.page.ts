import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { LoadingController, Platform, AlertController, NavController, ToastController } from '@ionic/angular';


import { SessionService } from 'src/app/shared/session.service';
import { Router, ActivatedRoute } from '@angular/router';


import { environment } from 'src/environments/environment.prod';
import { LoadingService } from 'src/app/shared/loading.service';

@Component({
  selector: 'app-edit-individual-listing',
  templateUrl: './edit-individual-listing.page.html',
  styleUrls: ['./edit-individual-listing.page.scss'],
})
export class EditIndividualListingPage implements OnInit {



  propertyForm: FormGroup;
 

  public sessionID;
  public userID;

  private address:string;
  private legalLandDescription:string;
  private price: string;
  private propertyType: string;
  private moreDetails: string;
  private propertyLandSize;
  private propertyLandSizeUnit;
  private propertyID;

  private propertyData;
  constructor(
    private formBuilder: FormBuilder,
   
    private loadingCtrl: LoadingController,
    private http: HttpClient,
  
   
    private session: SessionService,
    private alertController: AlertController,
    private router: Router,
    private navCtrl: NavController,
  
    private loading: LoadingService,
    private activatedroute: ActivatedRoute,
    private toastController:ToastController,
    
  ) { 



  
    

    this.propertyForm = this.formBuilder.group({
      address: [this.address, Validators.required],
      legalLandDescription: [this.legalLandDescription, Validators.required],
      propertyLandSize:[this.propertyLandSize, Validators.required],
      propertyLandSizeUnit: [this.propertyLandSizeUnit, Validators.required],
      price: [this.price, Validators.required],
      propertyType: [this.propertyType, Validators.required],
      moreDetails: [this.moreDetails],
    });
  }

  async ngOnInit() {
  

    this.propertyID = this.activatedroute.snapshot.paramMap.get('propertyID');
    await this.session.init();

    await this.getSessionData();
    
await this.getPropertyListings();
  
    

  }

  async ionViewDidEnter() {
 



  }

  async getSessionData() {
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : ' + sessionID_data);
    console.log('USER ID : ' + userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;
  }


  async getPropertyListings(){
    this.loading.present('Loading Property');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept':'application/json'
        
      }),
    };
  

  
    this.http.get(environment.API_URL+"property?userID="+this.userID+"&sessionID="+this.sessionID+"&propertyID="+this.propertyID, httpOptions).subscribe((data: any[]) => {
      if(data != null){
        this.propertyData = data;
        this.address = this.propertyData['address'];
        this.legalLandDescription = this.propertyData['land_description'];
        this.price =  this.propertyData['price'];
        this.propertyType = this.propertyData['property_type'];
        this.moreDetails =  this.propertyData['property_description'];
        this.propertyLandSize = this.propertyData['size'];
        this.propertyLandSizeUnit = this.propertyData['unit_type'];
        this.propertyID = this.propertyData['propertyID'];
        console.log(this.propertyData);

        this.propertyForm.setValue({
          address: this.propertyData['address'],
          legalLandDescription: this.propertyData['land_description'],
          propertyLandSize: this.propertyData['size'],
          propertyLandSizeUnit: this.propertyData['unit_type'],
          price: this.propertyData['price'],
          propertyType: this.propertyData['property_type'],
          moreDetails: this.propertyData['property_description']
        });
        this.loading.dismiss();

      } else {
        console.log('Error: No property data found');
        this.loading.dismiss();
      }
    }, error => {
        console.log('Error fetching property data: ', error);
        this.loading.dismiss();
    });
   }

 

  
  async onSubmit() {

    // price: [this.price, Validators.required],
    // propertyType: [this.propertyType, Validators.required],
    // moreDetails: [this.moreDetails],
    var price = this.propertyForm.get('price').value;
    var property_type = this.propertyForm.get('propertyType').value;
    var moreDetails = this.propertyForm.get('moreDetails').value;

    if(price != null && property_type != "" && moreDetails != ""){
   

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          observe: 'response' as const
        };
  
        let putData = {
          'propertyID':this.propertyID,
          'price':price,
          'property_type':property_type,
          'property_description':moreDetails
  
        }
        var errorcode = null;
  
        try {
          this.loading.present('Updating Property');
          const response: HttpResponse<any> = await this.http.put(`${environment.API_URL}property?userID=${this.userID}&sessionID=${this.sessionID}`, putData, httpOptions).toPromise();
          errorcode = response.status
          console.log(response.statusText)
          this.loading.dismiss();
          if (response.status == 200) {
            console.log(response.body.message)
            this.successAlert();
          
          }
        } catch (error) {
          console.log(error);

        }
    }
    else{
      this.incompleteToast();
    }

   
  }






 
  async successAlert() {
    const alert = await this.alertController.create({
      header: 'Update Property Listing',
      subHeader: 'Success!',
      message: 'You have successfully updated your property listing',
      buttons: [{
        text:'OK',
        handler: () =>{
          this.router.navigate(['/home']);
        }
      }],
   
    });

    await alert.present();
  }





  async incompleteToast() {
    const toast = await this.toastController.create({
      message: 'Please fill in the fields completely.',
      duration: 3000,
      position: 'bottom'
    });

    await toast.present();
  }




}
