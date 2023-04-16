import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from 'src/app/shared/loading.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { SessionService } from 'src/app/shared/session.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
   // Get an instance of the HomePage component

    apiURL = environment.API_URL;
  userData: any;
  firstname: any;
  middlename: any;
  lastname: any;
  birthdate: any;
  address: any;
  phone_number: any;
  userID: any;
  sessionID: any;
  imageUrl:any;
  constructor(
    private session: SessionService,
    private http: HttpClient,
    private loading: LoadingService,
    private router: Router,
    private toastController:ToastController,
    private navCtrl:NavController
  ) { }

  async ngOnInit() {
    await this.session.init();
    await this.getSessionData();
    await this.getProfileInfo();
  
  }

  



  async getSessionData() {
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : ' + sessionID_data);
    console.log('USER ID : ' + userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;


  }


  async getProfileInfo() {
    try {

      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.loading.present('');

      const data = await this.http.get(this.apiURL + 'user?userID=' + this.userID, { headers }).toPromise();
      this.loading.dismiss();
      this.userData = JSON.parse(data.toString());

      console.log(this.userData);


      this.phone_number = this.userData.phone_number;
      this.firstname = this.userData.user_fname;
      this.middlename = this.userData.user_mname;
      this.lastname = this.userData.user_lname;
      this.birthdate = this.userData.user_birthdate;
      this.imageUrl = this.userData.user_img;
      this.imageUrl = this.imageUrl === null?"assets/icon/user.svg":this.imageUrl;


    } catch (error) {
      console.error(error);
    }
  }
 
  async updateProfileInfo() {

    if (
      this.userID &&
      this.firstname &&
      this.lastname &&
      this.birthdate &&
   
      this.phone_number
    ) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response' as const
      };

      let putData = {
        'userID': this.userID,
        'user_fname': this.firstname,
        'user_mname': this.middlename,
        'user_lname': this.lastname,
        'user_birthdate': this.birthdate,
        'phone_number': this.phone_number

      }
      var errorcode = null;

      try {
        this.loading.present('Updating Info');
        const response: HttpResponse<any> = await this.http.put(this.apiURL+'user', putData, httpOptions).toPromise();
        errorcode = response.status
        console.log(response.statusText)
        this.loading.dismiss();
        if (response.status == 200) {
          console.log(response.body.message)
   
          this.router.navigate(['/home/userprofile']);
        }
      } catch (error) {
        console.log(error);

      }
    }
    else {
      this.incompleteToast();
    }
  }

  async incompleteToast() {
    const toast = await this.toastController.create({
      message: 'You must complete the fields. Middle name is optional.',
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }

  changeImage(){
    console.log('clicked');
  }

}
