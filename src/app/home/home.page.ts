import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform, NavController } from '@ionic/angular';
import { SessionService } from 'src/app/shared/session.service';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private sessionID;
  private userID;
  userData: any;
  user_img: any;

  constructor(
    private session:SessionService,
    public navCtrl: NavController,
    private activatedroute:ActivatedRoute,
    private router:Router,
    private http: HttpClient,
  
  ) {
    
    this.session.init();
  
         
       

    if (!isPlatform('capacitor')){
      GoogleAuth.initialize();
    }
   }

  //  apiURL = 'http://192.168.1.2:5000';
   apiURL = environment.API_URL;
  async ngOnInit() {

    await this.session.init();

    await this.getSessionData();
    await this.getProfileInfo();

  }

  async ionViewDidEnter(){}
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
  
      this.user_img = this.userData.user_img;
      this.user_img = this.user_img === null?"assets/icon/user.svg":this.user_img;

    } catch (error) {
      console.error(error);
    }
  }
  async ionViewWillEnter() {
    // Call the method here to make sure the page has fully loaded

   
  }

}
