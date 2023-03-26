import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/shared/loading.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { SessionService } from 'src/app/shared/session.service';
import { Router } from '@angular/router';
import { ToastController,AlertController } from '@ionic/angular';


@Component({
  selector: 'app-account-deactivation',
  templateUrl: './account-deactivation.page.html',
  styleUrls: ['./account-deactivation.page.scss'],
})
export class AccountDeactivationPage implements OnInit {
  sessionID:any;
  userID:any;
  private confirmpasswordAlert: any;
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

  async deactivateAccount(password){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response' as const
    };

    let patchData = {
      'sessionID': this.sessionID,
      'userID': this.userID,
      'user_password': password
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

      if(response.body.message === 'incorrect password')
      {
        await this.dismissConfirmPasswordAlert();
        await this.passwordNotEqualAlert();
      }
      if(response.body.message === 'error deactivating')
      {
        await this.dismissConfirmPasswordAlert();
        await this.errorDeactivatingAlert();
      }
      if(response.body.message === 'user not found')
      {
        await this.dismissConfirmPasswordAlert();
        await this.errorUserDoesNotExistAlert();
      }
     
   
    } catch (error) {
      console.log('ERROR: ');
   

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

  async confirmPassword() {
    this.confirmpasswordAlert = await this.alertController.create({
      header: 'Enter password to continue',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Enter Password'
        },
        {
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Confirm Password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }, {
          text: 'Deactivate',
          handler: (data) => {
            console.log('Save clicked', data.password, data.confirmPassword);
            // Do something with the password and confirm password values

            if(data.password === data.confirmPassword){
              console.log('Executed');
              this.deactivateAccount(data.password);
            }
            else{
              this.passwordNotEqualAlert();
            }
          }
        }
      ]

      
    });

    await this.confirmpasswordAlert.present();
  
    
  }

  dismissConfirmPasswordAlert() {
    if (this.confirmpasswordAlert) {
      this.confirmpasswordAlert.dismiss();
    }
  }

  async passwordNotEqualAlert() {
    const alert = await this.alertController.create({
      header: 'Password Input',
      subHeader: '',
      message: 'The password you have entered are not equal',
      buttons: ['OK'],
    });

    await alert.present();
  }


  async errorDeactivatingAlert() {
    const alert = await this.alertController.create({
      header: 'Error Deactivating',
      subHeader: '',
      message: 'Error deactivating your account. Please try again.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  
  async errorUserDoesNotExistAlert() {
    const alert = await this.alertController.create({
      header: 'Error Deactivating',
      subHeader: '',
      message: "Error deactivating your account. It seems that your account doesn't exists. Please contact the admin. ",
      buttons: ['OK'],
    });

    await alert.present();
  }

}
