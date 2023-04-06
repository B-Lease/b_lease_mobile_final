import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Router,ActivatedRoute } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core';
import { NavController } from '@ionic/angular';
import { SessionService } from 'src/app/shared/session.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;
  propertyData: any[] = [];
  private sessionID;
  private userID;
  public dataLoaded = false;
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
    private http:HttpClient
    
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
    await this.session.init();
    await this.getSessionData();
    await this.getPropertyListings();
  }



  
  async ngOnInit() {

  }

  getPropertyListings(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept':'application/json'
        
      }),
    };

    this.http.get(this.apiURL+"?sessionID="+this.sessionID, httpOptions).subscribe((data: any[]) => {
      this.propertyData = data;
      console.log(this.propertyData);
      this.dataLoaded = true;
    });
   }

  // async openInbox(){ 
  //   const data = {
  //     userID :  await this.session.getUserID()
  //   };
  //   this.navCtrl.navigateForward('list-of-messages', { queryParams: { data } });

  // }



  async getSessionData(){
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : '+sessionID_data);
    console.log('USER ID : '+userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;


 }

}
