import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { OtpApiService } from 'src/app/shared/otp-api.service';
import { Router,ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/shared/loading.service';



@Component({
  selector: 'app-signup-send-otp',
  templateUrl: './signup-send-otp.page.html',
  styleUrls: ['./signup-send-otp.page.scss'],
})
export class SignupSendOtpPage implements OnInit {
  apiURL = 'http://192.168.1.2:5000';
  public fixedSeconds = 120
  public minutes
  public seconds
  public email
  public otp_input_1
  public otp_input_2
  public otp_input_3
  public otp_input_4
  public otp_input_5
  public otp_input_6
  isTimeOut = false
 
  public interval
  constructor(
    private alertController: AlertController,
    public otp:OtpApiService, 
    private activatedroute:ActivatedRoute, 
    public router:Router,
    private loadingCtrl: LoadingController,
    private toastController:ToastController,
    public loading: LoadingService,
    private navCtrl:NavController
              ) {

   }


  ngOnInit() {
    this.interval =   setInterval(() => {       
      this.fixedSeconds -=1
      this.email = this.activatedroute.snapshot.paramMap.get('email')
      this.minutes = parseInt((this.fixedSeconds/60).toString());
      this.minutes.toFixed();
      this.seconds = this.fixedSeconds%60;
      if(this.seconds <10)
      {
        this.seconds = "0"+this.seconds
      }
      
      if(this.fixedSeconds == 0)
      {
        clearInterval(this.interval)

        this.timeoutOTP(this.email)

      }
    }, 1000);
    
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  async expireAlert() {
    const alert = await this.alertController.create({
      header: 'Your OTP has expired',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
          
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  
  }
  async verifiedAlert() {
    const alert = await this.alertController.create({
      header: 'Your email has been verified successfully',
      buttons: [
        {
          text: 'Done',
          role: 'confirm',
          handler: () => {
            
          clearInterval(this.interval);
        
          this.navCtrl.navigateForward(['/signup', {email:this.email}]);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  
  }
  async notverifiedAlert() {
    const alert = await this.alertController.create({
      header: 'Incorrect OTP code',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
          
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  
  }

  timeoutOTP(email:any){
    
    let sent = this.otp.expireOTP(email);

    if(sent['data'] = true)
    {
      this.expireAlert()
      this.isTimeOut = true
    }

  }

  async generateOTP(){


    this.loading.present('Generating OTP');
    let sent = await this.otp.createOTP(this.email);
    this.loading.dismiss();
    console.log(sent['message']);

    if(sent['message'] == 'success'){
      this.fixedSeconds = 120;
      this.isTimeOut = false;
      this.router.navigateByUrl('/signup-number/'+this.email, {skipLocationChange: true}).then(() => {
        this.router.navigate(['/signup-send-otp/'+this.email]);
  
        });
    }



  }

  verifyOTP(){
    const delay = ms => new Promise(res => setTimeout(res, ms));
    this.loading.present('Verifying OTP');
  
    if(this.otp_input_1 && this.otp_input_2 && this.otp_input_3 && this.otp_input_4 && this.otp_input_5 &&this.otp_input_6)
    {
      let otp = this.otp_input_1+this.otp_input_2+this.otp_input_3+this.otp_input_4+this.otp_input_5+this.otp_input_6
    var verified = null
  
    fetch(this.apiURL+"/register?email="+this.email+"&otp="+otp)
    
    .then(response => response.json())
    .then(data => {
  

      delay(3000);
      this.loading.dismiss();
      verified = data['message']
      
      // this.verifyOTPLoading();
      if (verified === 'OTP not found')
      {
       console.log('not found');
       this.notverifiedAlert()
      }
      if (verified === 'OTP found'){
        console.log('found');
        this.verifiedAlert()
      }
    })
    .catch(err => {
      console.log(err);
    })
    

     }
    else{
    this.otpIncompleteToast();
    }
    
    
  }
  

  async otpIncompleteToast() {
 
    var message = "Please fill the OTP code completely";
   
    const toast = await this.toastController.create({
    
      message: message,
      duration: 3000,
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
          handler: () => {  }
        }
      ]
    });

    await toast.present();

    const { role } = await toast.onDidDismiss();

  }
}
