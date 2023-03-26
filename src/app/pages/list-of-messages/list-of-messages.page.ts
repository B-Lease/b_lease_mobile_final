import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router,ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-list-of-messages',
  templateUrl: './list-of-messages.page.html',
  styleUrls: ['./list-of-messages.page.scss'],
})
export class ListOfMessagesPage implements OnInit {
  response: any[];
  userID: any;
  
  leasingId: string = ''
  
  constructor(private http: HttpClient, private activatedroute: ActivatedRoute, private router: Router, private navCtrl: NavController) {

    const data = this.activatedroute.snapshot.queryParams['data'];
    this.userID = data['userID']; //userID of user

    this.http.get(`http://localhost:5000/leasing?userID=${this.userID}`).subscribe((data) => {
      if (typeof data === 'string') {
        this.response = JSON.parse(data);

      } else {
        this.response = Object.values(data);

      }
    });

    
  }

  ngOnInit() {

  }


  
  saveFields(itemLeasingId: string, firstname:string, userID:string): void {
    
    this.leasingId = itemLeasingId; // update leasingId with the value of item.LEASINGID

    const data = {
      leasingID : itemLeasingId,
      userID: this.userID,
      msg_senderID: this.userID,
      msg_receiverID : userID,
      user_fname : firstname
    };
    
    this.navCtrl.navigateForward('chatroom', { queryParams: { data } });
    // console.log(leasingID);
    // this.router.navigate(['/chatroom/'+userID+'/'+leasingID+'/'+user_fname]);


  }

  
}