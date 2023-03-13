import { Component } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { LoadingService } from 'src/app/shared/loading.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { SessionService } from 'src/app/shared/session.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-account-deletion',
  templateUrl: './account-deletion.page.html',
})
export class AccountDeletionPage {
  sessionID:any;
  userID:any;

  constructor(
    private animationCtrl: AnimationController,
    private loading:LoadingService,
    private http:HttpClient,
    private session:SessionService,
    private router: Router,
    private toastController: ToastController,
    private alertController:AlertController
    ) {}

  
    apiURL = 'http://192.168.1.2:5000';

  async ngOnInit(){
    await this.session.init();
    await this.getSessionData();
  }
  async deleteAccount(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response' as const
    };

     this.loading.present('Deleting Account');

    try{
        
      this.loading.dismiss();
      const response: HttpResponse<any> = await this.http.delete('http://192.168.1.2:5000/user?sessionID='+this.sessionID+"&userID="+this.userID, httpOptions).toPromise();
      
      if(response.body.message === 'deleted')
      {
       await this.deleteAlert();
      
      } 
    }catch(error){
      console.log(error);
    }



  }

  async getSessionData() {
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : ' + sessionID_data);
    console.log('USER ID : ' + userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;


  }

  async deleteAlert() {
    const alert = await this.alertController.create({
      header: 'Your account has been deleted.',
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