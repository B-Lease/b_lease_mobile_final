import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/shared/loading.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { SessionService } from 'src/app/shared/session.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-account-deactivation',
  templateUrl: './account-deactivation.page.html',
  styleUrls: ['./account-deactivation.page.scss'],
})
export class AccountDeactivationPage implements OnInit {
  sessionID:any;
  userID:any;

  constructor(
    private loading:LoadingService,
    private http:HttpClient,
    private session:SessionService,
    private router:Router,
    private toastController:ToastController,
    private alertController:AlertController
  ) { }

  apiURL = 'http://192.168.1.2:5000';
  async ngOnInit() {
    await this.session.init();
    await this.getSessionData();
  }

  
  async getSessionData() {
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : ' + sessionID_data);
    console.log('USER ID : ' + userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;


  }

  async deactivateAccount(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response' as const
    };

    let patchData = {
      'sessionID': this.sessionID,
      'userID': this.userID,
    }
    var errorcode = null;

    try {
      this.loading.present('Deactivating Account');
      const response: HttpResponse<any> = await this.http.patch('http://192.168.1.2:5000/user', patchData, httpOptions).toPromise();
      
    
      this.loading.dismiss();
      if( response.body.message == 'deactivated')
      {
        this.deactivateAlert();
      }
     
   
    } catch (error) {
      console.log(error);

    }



  }
  async deactivateAlert() {
    const alert = await this.alertController.create({
      header: 'Your account has been deactivated.',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: async () => {
            
              await this.session.logOutSession();
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  
  }

}
