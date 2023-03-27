import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router,ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { SessionService } from 'src/app/shared/session.service';
@Component({
  selector: 'app-list-of-messages',
  templateUrl: './list-of-messages.page.html',
  styleUrls: ['./list-of-messages.page.scss'],
})
export class ListOfMessagesPage implements OnInit {
  response: any[];
  userID: any;
  sessionID:any;
  leasingId: string = ''
  
  constructor(
    private http: HttpClient, 
    private activatedroute: ActivatedRoute, 
    private router: Router, 
    private navCtrl: NavController,
    private session:SessionService
    ) {


 

    // //get user ID from dashboard or chatroom
    // const data = this.activatedroute.snapshot.queryParams['data'];
    // this.userID = data['userID'];

    this.http.get(`http://192.168.1.2:5000/leasing?check_existing=no&userID=${this.userID}`).subscribe((data) => {
      if (typeof data === 'string') {
        this.response = JSON.parse(data);
        console.log(this.response)
      } else {
        this.response = Object.values(data);
        console.log(this.response)
      }
    });



    
  }

  async ngOnInit() {
    await this.session.init();
    await this.getSessionData();
  }


  
  saveFields(itemLeasingId: string, firstname:string, userID:string, lesseeID: string): void {
    
    this.leasingId = itemLeasingId; // update leasingId with the value of item.LEASINGID
    var msg_senderID = '';
    var msg_receiverID = '';

    //if the current user is the lessor, the sender is the lessor
    //if the current user is the lessee, the sender is the lessee
    if (this.userID == userID){
      msg_senderID = this.userID;
      msg_receiverID = lesseeID;
    } else {
      msg_senderID = lesseeID;
      msg_receiverID = userID;
    }

    const data = {
      leasingID : itemLeasingId,
      userID: this.userID,
      msg_senderID: msg_senderID,
      msg_receiverID : msg_receiverID,
      user_fname : firstname,
      lessorID: userID
    };
    

    this.navCtrl.navigateForward('chatroom', { queryParams: { data } });
    // console.log(leasingID);
    // this.router.navigate(['/chatroom/'+userID+'/'+leasingID+'/'+user_fname]);


  }

  async getSessionData(){
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : '+sessionID_data);
    console.log('USER ID : '+userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;


 }
 
 //for navbar
 openInbox(){
  const data = {
    userID : this.userID
  };
  this.navCtrl.navigateForward('list-of-messages', { queryParams: { data } });

}

navigateProfile(){
  this.router.navigate(['/profile']);
}


  
}







