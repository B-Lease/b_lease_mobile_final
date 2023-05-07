import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController, ToastController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment.prod';
import { SessionService } from 'src/app/shared/session.service';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/shared/util.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  public environment = environment;

  sessionID:any;
  userID:any;
  notificationData;
  unreadNotifications:number = 0;
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private session:SessionService,
    private router:Router,
    private navCtrl:NavController,
    private util:UtilService,
    private toastCtrl:ToastController
    ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    // Call the method here to make sure the page has fully loaded
    await this.session.init();

    await this.getSessionData();
    await this.getNotifications();

    await this.countUnreadNotifications();
   
  }

  async getSessionData(){
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : '+sessionID_data);
    console.log('USER ID : '+userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;


 }


  async presentActionSheet(notification) {
    var notificationID = notification.notificationID;
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Notification Action',
      buttons: [
        {
          text: 'Remove this notification',
          role: 'destructive',
          icon: 'trash', // Add icon here
          data: {
            action: 'delete',
          },  
          handler: () =>{
              console.log(notificationID);
              this.deleteNotification(notificationID);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close-outline',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }


  async getNotifications(){
    await axios.get(environment.API_URL+'notifications'+`?sessionID=${this.sessionID}&userID=${this.userID}`)
    .then(response => {
      console.log(response.data);
      this.notificationData = JSON.parse(response.data.toString());
    })
    .catch(error => {
      console.log(error);
    });


    console.log(this.notificationData);
  }
  async deleteNotification(notificationID){
    await axios.delete(environment.API_URL+'notifications'+`?sessionID=${this.sessionID}&userID=${this.userID}&notificationID=${notificationID}`)
    .then(response => {
      console.log(response.data);
      if(response.data.message === 'Notification deleted')
      {
         this.showToast('Notification deleted');
      }
      else{
        this.showToast('Error deleting notification');
      }
    })
    .catch(error => {
      console.log(error);
    });

    await this.getNotifications();

    await this.countUnreadNotifications();
    console.log(this.notificationData);
  }


 async viewNotification(notification:any){
    console.log(notification.notification_categ);
    var categ = notification.notification_categ;
    
   await this.util.readNotification(notification.notificationID, this.userID, this.sessionID);
    
    if(categ === 'Property Listing Approval')
    {
      var status = notification.data.split(",")[2];
      var propertyID = notification.data.split(",")[0];
      console.log("Reading property listing approval notification");

      if(status ==='approved')
      {
        this.router.navigate(['/view-individual-listing/'+propertyID]);
      }
      if(status === 'rejected')
      {
        this.router.navigate(['/viewmylistingproperty/'+propertyID]);
      }
    }
    if(categ === 'Property Inquiries')
    {
      var message_data = notification.data.split("*|*");

      const data = {
        userID: message_data[0],
        leasingID : message_data[1],
  
        'lessorID':message_data[2] ,
        'lessor_fname' : message_data[3],
        'lessor_mname' : message_data[4],
        'lessor_lname' :message_data[5],
  
        'lesseeID' : message_data[6],
        'lessee_fname' : message_data[7],
        'lessee_mname' : message_data[8],
        'lessee_lname' :message_data[9] ,
  
        'address' : message_data[10],
        'land_description' : message_data[11],
  
        'msg_senderID': message_data[12],
        'msg_receiverID' :message_data[13] ,
        'msg_receivername': message_data[14]
      };
  
  
  
      this.navCtrl.navigateForward('chatroom', { queryParams: { data } });
    }
    if(categ === 'Leasing Contract')
    {
        console.log('Leasing Contract');
        var contract_data =  notification.data.split("*|*");

        this.navCtrl.navigateForward(['/preview-contract',
        {
          leasingID: contract_data[0],
          propertyID:contract_data[1],
          address: contract_data[2],
          leasing_status:contract_data[3],
          propertyImage:contract_data[4],
          lessorID: contract_data[5],
          lesseeID: contract_data[6],	
          userID: this.userID
        }
      ]);
    }
    if(categ === 'Complaints')
    {

      const data = {
        complaintID: notification.data
      }
      this.navCtrl.navigateForward('/complaint-thread', { queryParams: { data } });

    }
  }

  async countUnreadNotifications()
  {
    const result = await axios.get(environment.API_URL +`notifications/countUnread?userID=${this.userID}`)
    .then(response =>{
      console.log("TOTAL UNREAD NOTIFICATIONS");
      console.log(response.data['unreadNotifications']);
      this.unreadNotifications = response.data['unreadNotifications'];
    })
    .catch(error =>{
      console.error(error);
    });  
  }
async showToast(msg){
  let toast = await this.toastCtrl.create({
    message: msg,
    duration: 2000

  });
  toast.present();
}


}
