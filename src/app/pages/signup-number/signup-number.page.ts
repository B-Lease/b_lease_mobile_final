import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router,ActivatedRoute} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OtpApiService } from 'src/app/shared/otp-api.service';
import { LoadingService } from 'src/app/shared/loading.service';


@Component({
  selector: 'app-signup-number',
  templateUrl: './signup-number.page.html',
  styleUrls: ['./signup-number.page.scss'],
})

export class SignupNumberPage implements OnInit {
  handlerMessage = '';
  roleMessage = '';

  public email = "";

  public isPost = false;

  // PHILIPPINE NETWORK PROVIDER PREFIXES
  // public sun_prefix = [
  //   '0922', '0923', '0924', '0925', '0931', '0932', '0933','0934', '0940',
  //   '0941','0942','0943','0944','0973','0974'];
  // public globe_tm_prefix = [
  //   '0817','0904','0905','0906','0915','0916','0917','0926','0927','0935',
  //   '0936','0937','0945','0954','0955','0956','0965','0966','0967','0975',
  //   '0976','0977','0978','0979','0995','0996','0997','09173','09175','09176',
  //   '09178','09253','09255','09256','09257','09258'
  // ];

  // public talkntext = [
  //   '0907','0909','0910','0912',
  //   '0918','0930','0938','0946',
  //   '0948','0950','0963','0989','0998'
  // ]

  // public dito = [
  //   '0895','0896','0897','0898',
  //   '0991','0992','0993','0994'
  // ]
  constructor(private toastController: ToastController, private router:Router, public otp:OtpApiService, public loadingService:LoadingService,private activatedroute:ActivatedRoute){
    this.email = this.activatedroute.snapshot.paramMap.get('email')
  }
  ngOnInit() {
    
  }

  async emailValidateToast(state) {
    var message = "";
    if (state == 'empty'){
      message = "Please provide your email";
    }
    if(state == 'invalid')
    {
      message = "You have entered an invalid email.";
    }
    if(state =='error'){
      message = "Error submitting your email. Try again";
    }
    const toast = await this.toastController.create({
    
      message: message,
      duration: 3000,
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
          handler: () => { this.handlerMessage = 'Dismiss clicked'; }
        }
      ]
    });

    await toast.present();

    const { role } = await toast.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
  }

  isValid(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
    }

  async generateOTP(email:any){
    this.loadingService.present('Generating OTP');
    let sent = await this.otp.createOTP(email);
    this.loadingService.dismiss();
    console.log(sent['message']);

    if(sent['message'] == 'success'){
      this.router.navigate(['/signup-send-otp/'+email]);
    }
    if(sent['message'] == 'error'){
      this.emailValidateToast('error');
    }

  }
  checkEmail(){
  
    // console.log(this.isValid(this.email))


    var valid = this.isValid(this.email)

    // var prefix_phone_number = "09"+this.phone_number.substring(0,2);
    // // console.log(prefix_phone_number);
    // var sun_check = this.sun_prefix.includes(prefix_phone_number);
    // var globe_tm_check = this.globe_tm_prefix.includes(prefix_phone_number);
    // var talkntext_check = this.talkntext.includes(prefix_phone_number);
    // var dito_check = this.dito.includes(prefix_phone_number);

    if(this.email.length==0 && valid == false){
      var state = 'empty';
      this.emailValidateToast(state)
    }
    if(!(this.email.length==0) && valid == false){
      var state = 'invalid';
      this.emailValidateToast(state)
    }
    
    if(!(this.email.length==0) && valid == true){
      this.generateOTP(this.email)
    }



   


  //   if (this.phone_number.length<9 && this.phone_number.length>0 )
  //   {
  //     var state = "incomplete";
  //     this.phoneNumberValidateToast(state)
  //   }

  //   else{
  //   if(sun_check ||globe_tm_check ||  talkntext_check ||dito_check && this.phone_number.length==9 ){
  //     this.router.navigateByUrl('/signup-send-otp');
  //     this.phone_number = "";
  //     this.sendPostRequest(this.phone_number)
  //   }
  //   else{
  //     if(this.phone_number.length==9)
  //     {
  //     var state = "invalid";
  //     this.phoneNumberValidateToast(state)
  //   }
  //   }
  // }
  // }
  }
}