import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router,ActivatedRoute, Route } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionService } from 'src/app/shared/session.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private sessionID;
  private userID;
  userData:any;


  phone:any
  firstname:any
  middlename:any
  lastname:any
  email:any
  address:any

  constructor(
    public navCtrl: NavController,
    private activatedroute:ActivatedRoute,
    private router:Router,
    private http: HttpClient,
    private session:SessionService,
    private actionSheetCtrl:ActionSheetController
    ) { 
    this.getProfileInfo();
    this.session.init();
  
    this.navCtrl.navigateForward('/profile', { animated: false });

  }
  
  apiURL = 'http://192.168.1.2:5000';
  async ngOnInit() {
    // this.sessionID = this.activatedroute.snapshot.paramMap.get('sessionID')
    // this.userID = this.activatedroute.snapshot.paramMap.get('userID')
    // console.log('SESSION: '+this.sessionID);
    // console.log('USERID: '+this.userID);
    await this.session.init();

    await this.getSessionData();
   
    await this.getProfileInfo();
   


  }

  async ngAfterInit(){
    await this.getSessionData();
  }

  async getSessionData(){
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : '+sessionID_data);
    console.log('USER ID : '+userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;


 }

  public async getProfileInfo() {
    try {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      const data = await this.http.get(this.apiURL + '/user?userID=' + this.userID, { headers }).toPromise();
  
      this.userData = JSON.parse(data.toString());
      
      console.log(this.userData);

      this.phone = this.userData.phone_number;
      this.firstname = this.userData.user_fname;
      this.middlename = this.userData.user_mname;
      this.lastname = this.userData.user_lname;
      this.email = this.userData.user_email;
      this.address = this.userData.address;
    } catch (error) {
      console.error(error);
    }
  }
  ionViewDidEnter() {
    // Call the method here to make sure the page has fully loaded
    this.getProfileInfo();
   
  }

  navigateMyListing(){

      this.router.navigate(['/my-listing']);

  }
 
  async logoutActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Log out',
      subHeader: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Yes',
          role: 'destructive',
          data: {
            action: 'logout',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    if( result.data?.action == 'logout'){
      await this.session.logOutSession();
    }
  }




}
