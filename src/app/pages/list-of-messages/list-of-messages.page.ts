import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router,ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { SessionService } from 'src/app/shared/session.service';
import { environment } from 'src/environments/environment.prod';
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
  apiURL = environment.API_URL;
  
  constructor(
    private http: HttpClient, 
    private activatedroute: ActivatedRoute, 
    private router: Router, 
    private navCtrl: NavController,
    private session:SessionService
    ) {
    
  }

  async ngOnInit() {
    await this.session.init();
    await this.getSessionData();

    // get user ID from dashboard or chatroom
    this.http.get(this.apiURL+`leasing?check_existing=no&userID=${this.userID}`).subscribe((data: any[]) => {
      if (typeof data === 'string') {
        this.response = JSON.parse(data);
        console.log(this.response)
      } else {
        this.response = Object.values(data);
        console.log(this.response)
      }
    });
  }


  
  saveFields(item): void {
    var msg_senderID = '';
    var msg_receiverID = '';
    var msg_receivername = '';

    // if the current user is the lessor, the sender is the lessor
    // if the current user is the lessee, the sender is the lessee
    if (this.userID == item.lessorID){
      msg_senderID = this.userID;
      msg_receiverID = item.lesseeID;
      msg_receivername = item.lessee_fname;
    } else {
      msg_senderID = item.lesseeID;
      msg_receiverID = this.userID;
      msg_receivername = item.lessor_fname;
    }

    const data = {
      userID: this.userID,
      leasingID : item.leasingID,

      'lessorID': item.lessorID,
      'lessor_fname' : item.lessor_fname,
      'lessor_mname' : item.lessor_mname,
      'lessor_lname' : item.lessor_lname,

      'lesseeID' : item.lesseeID,
      'lessee_fname' : item.lessee_fname,
      'lessee_mname' : item.lessee_mname,
      'lessee_lname' : item.lessee_lname,

      'address' : item.address,
      'land_description' : item.land_description,

      'msg_senderID': msg_senderID,
      'msg_receiverID' : msg_receiverID,
      'msg_receivername': msg_receivername
    };



    this.navCtrl.navigateForward('chatroom', { queryParams: { data } });

  }

  async getSessionData(){
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : '+sessionID_data);
    console.log('USER ID : '+userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;


 }
 


navigateProfile(){
  this.router.navigate(['/profile']);
}


  
}







