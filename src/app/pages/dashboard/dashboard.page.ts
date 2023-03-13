import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Router,ActivatedRoute } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core';
import { NavController } from '@ionic/angular';
import { SessionService } from 'src/app/shared/session.service';



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

  private sessionID;
  private userID;
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
    private session:SessionService
    
    ) { 
      // this.loadSession();
    this.navCtrl.navigateForward('/dashboard', { animated: false });

  }

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
  

  
  async ngOnInit() {
    await this.session.init();
    await this.getSessionData();
  }

  openInbox(){

    
    this.navCtrl.navigateForward('list-of-messages');

  }

  navigateProfile(){
    this.router.navigate(['/profile']);
  }
  async getSessionData(){
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : '+sessionID_data);
    console.log('USER ID : '+userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;


 }

}
