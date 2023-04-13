import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import axios from 'axios';
import { environment } from 'src/environments/environment.prod';
import { SessionService } from 'src/app/shared/session.service';
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
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private session:SessionService
    ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    // Call the method here to make sure the page has fully loaded
    await this.session.init();

    await this.getSessionData();
    await this.getNotifications();
   
  }

  async getSessionData(){
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : '+sessionID_data);
    console.log('USER ID : '+userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;


 }


  async presentActionSheet() {
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


  viewNotification(notification:any){
    console.log(notification.notification_categ);
    var categ = notification.notification_categ;
    if(categ === 'Property Listing Approval')
    {
      
    }
  }

}
