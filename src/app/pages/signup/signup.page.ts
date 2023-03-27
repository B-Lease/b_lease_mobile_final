import {  HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from "@angular/forms";
import { Router,ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { finalize, map, Observable } from 'rxjs';
import { LoadingService } from 'src/app/shared/loading.service';

import { AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { MapboxServiceService } from 'src/app/shared/mapbox-service.service';
import { SessionService } from 'src/app/shared/session.service';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  pwdIcon = "eye-outline";
  showPwd = false;

  confirm_pwdIcon = "eye-outline";
  confirm_showPwd = false;
  isChecked: boolean = false;
  ageIsValid: boolean = true;
  ipAddress:string;
  isPassSame: boolean = true;

  isPassStrong: boolean = false;

  isPassCheck = '';

  userID:any;
  auth_type:any;
  imageUrl:any = null;
  public email_var;
  idToken:any;
  accessToken:any;
  isGoogleAuth=false;

  private first_name:string;
  private middle_name:string;
  private last_name:string;
  private birthdate;
  private phone_number;
  private password;

  lat:number;
  lng:number;
  constructor(
    private formBuilder: FormBuilder,  
    private activatedroute:ActivatedRoute, 
    private alertController:AlertController,
    public router:Router, 
    private toastController: ToastController, 
    private http:HttpClient,
    public loading: LoadingService, 
    public navCtrl:NavController,
    public mapbox:MapboxServiceService,
    private session:SessionService
    ) {
  
    this.getIPAddress();


    
  }


  togglePwd() {
    this.showPwd = !this.showPwd;
    this.pwdIcon = this.showPwd ? "eye-off-outline" : "eye-outline";
  }
  toggleConfirmPwd() {
    this.confirm_showPwd = !this.confirm_showPwd;
    this.confirm_pwdIcon = this.confirm_showPwd ? "eye-off-outline" : "eye-outline";
  }

  ngOnInit() {



    // this.getAddressValue();

    this.auth_type = this.activatedroute.snapshot.paramMap.get('auth_type');

    if(this.auth_type === 'google'){
      this.accessToken = this.activatedroute.snapshot.paramMap.get('accessToken');
      this.idToken = this.activatedroute.snapshot.paramMap.get('idToken');
      this.userID = this.activatedroute.snapshot.paramMap.get('userID')
      this.email_var = this.activatedroute.snapshot.paramMap.get('email')
      this.first_name = this.activatedroute.snapshot.paramMap.get('givenName');
      this.last_name = this.activatedroute.snapshot.paramMap.get('familyName');
      this.imageUrl = this.activatedroute.snapshot.paramMap.get('imageUrl');
      this.isGoogleAuth = true;

    }
    else{
      this.auth_type = "email"
      this.email_var = this.activatedroute.snapshot.paramMap.get('email');
      this.first_name = this.activatedroute.snapshot.paramMap.get('first_name');
      this.middle_name = this.activatedroute.snapshot.paramMap.get('middle_name');
      this.last_name = this.activatedroute.snapshot.paramMap.get('last_name');
      this.birthdate = this.activatedroute.snapshot.paramMap.get('birthdate');
      this.phone_number = this.activatedroute.snapshot.paramMap.get('phone_number');
      
    }


    this.first_name = this.first_name === null?'':this.first_name;
    this.middle_name = this.middle_name === null?'':this.middle_name;
    this.last_name = this.last_name === null?'':this.last_name;
    this.birthdate = this.birthdate === null?null:this.birthdate;
    this.phone_number = this.phone_number === null?'':this.phone_number;
    this.imageUrl = this.imageUrl === null?"assets/icon/user.svg":this.imageUrl;

    this.signupForm = this.formBuilder.group({
      first_name : new FormControl(this.first_name, [Validators.required, Validators.minLength(1)]),
      middle_name : new FormControl(this.middle_name),
      last_name : new FormControl(this.last_name, Validators.required),
      birthdate : new FormControl(this.birthdate, Validators.required),
      phone_number : new FormControl(this.phone_number, Validators.required),
      password : new FormControl(null, Validators.required),
      confirm_password : new FormControl(null, Validators.required),
      check_agree: [false]
    }
    );
  
  }

  
  async ionViewDidEnter(){

  }
  public validateAreEqual(fieldControl: FormControl) {
    return fieldControl.value === this.signupForm.get("password").value ? null : {
        NotEqual: true
    };
}

 checkPasswordStrength(){
  var password = this.signupForm.get("password").value;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const passwordStrengthLevels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

  if (password.match(regex)) {
    const score = this.calculatePasswordStrengthScore(password);
    if (score >= 80) {
      this.isPassStrong = true;
      this.isPassCheck = passwordStrengthLevels[4];
    } else if (score >= 60) {
      this.isPassStrong = true;
      this.isPassCheck = passwordStrengthLevels[3];
    } else if (score >= 40) {
      this.isPassStrong = true;
      this.isPassCheck = passwordStrengthLevels[2];
    } else if (score >= 20) {
      this.isPassCheck = passwordStrengthLevels[1];
    } else {
      this.isPassCheck = passwordStrengthLevels[0];
    }
  } else {
    this.isPassCheck = 'Invalid Password';
  }
}

 calculatePasswordStrengthScore(password: string): number {
  const regexArray = [/\d/g, /[a-z]/g, /[A-Z]/g, /[@$!%*?&]/g];
  const multiplierArray = [1, 2, 3, 5];

  let score = 0;
  for (let i = 0; i < regexArray.length; i++) {
    const match = password.match(regexArray[i]);
    if (match) {
      score += match.length * multiplierArray[i];
    }
  }
  score *= password.length / 8;

  return score;
}


checkAge(dateOfBirthStr: string): void {
  const dateOfBirth = new Date(dateOfBirthStr);
  const today = new Date();
  var age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  this.ageIsValid = age >= 18;
}

async accountExistsAlert(message:string) {
  const alert = await this.alertController.create({
    header: message,
    buttons: [
      {
        text: 'OK',
        role: 'confirm',
        handler: () => {
        
        },
      },
    ],
  });
}

 async onSubmit(){
    console.log(this.signupForm)

    var checked = this.signupForm.get('check_agree').value
    
    if(checked)
    {
      var first_name = this.signupForm.get('first_name').value;
      var middle_name = this.signupForm.get('middle_name').value;
      var last_name = this.signupForm.get('last_name').value;
      var birthdate = this.signupForm.get('birthdate').value;
      var phone_number = this.signupForm.get('phone_number').value;
      var password = this.signupForm.get('password').value;
      var confirm_password = this.signupForm.get('confirm_password').value;
  
      this.password = password;
      
      console.log(birthdate);
      if(first_name && last_name && birthdate && phone_number && password && confirm_password)
      {
        if(password === confirm_password){
          if(this.isPassStrong){
            this.checkAge(birthdate)
            if(this.ageIsValid){
              const httpOptions = {
                headers: new HttpHeaders({
                  'Content-Type': 'application/json'
                }),
                observe: 'response' as const
              };

              let postData = {
              
                "phone_number": phone_number,
                "user_password": password, 
                "user_fname": first_name,
                "user_mname": middle_name,
                "user_lname": last_name,
                "user_birthdate": birthdate,
                "user_email": this.email_var,
                "auth_type":this.auth_type
              }

              if (this.auth_type === 'google'){
                postData['userID'] = this.userID;
                postData['imageUrl'] = this.imageUrl;
              }

              var errorcode = null;
              // return await this.http.post('http://192.168.1.2:5000'+"/register", postData).toPromise();
                try{
                this.loading.present('Registering Account');
          
               
               
              

                  const headers = new HttpHeaders();
                  headers.append('Content-Type', 'application/json');
                  headers.append('Accept', 'application/json');
                  this.http.post('http://192.168.1.2:5000/user', postData, { headers: headers }).pipe(
                    finalize(() => {
                      this.loading.dismiss();
                 
                    })
                  ).subscribe(async res => {
                    
                    if(res['message'] == 'Success user creation')
                    {
                      await this.getIPAddress();
                      await this.successAlert(); 
                    }
                  });
     
               
              
              } catch(error){
                console.log(error);
                          
                if(errorcode == 409){
                  this.accountExistsAlert('An account has already existed.')
    
                  
                }
              }
            }
            else{
              this.underageToast();
            }
          }
          else{
            this.passnotstrongToast()
          }
        

        }
        else
        {
            this.incorrectPassToast();
        }
      }
      else{
        this.incompleteToast();
      }

   

    }
    else{
      this.agreeToast();
    }

    }


    async agreeToast() {
      const toast = await this.toastController.create({
        message: "Before you can complete your registration, you must accept B-Lease's Terms and Conditions.",
        duration: 1500,
        position: 'bottom'
      });
  
      await toast.present();
    }
    async passnotstrongToast() {
      const toast = await this.toastController.create({
        message: 'Your password is not strong enough. Your password should contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters.',
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
 
    async incorrectPassToast() {
      const toast = await this.toastController.create({
        message: "Passwords does not match",
        duration: 1500,
        position: 'bottom'
      });
  
      await toast.present();
    }
    async incompleteToast() {
      const toast = await this.toastController.create({
        message: "You must complete the fields. Middle name is optional.",
        duration: 1500,
        position: 'bottom'
      });
  
      await toast.present();
    }
    async underageToast() {
      const toast = await this.toastController.create({
        message: "You must be at least 18 years of age to register.",
        duration: 1500,
        position: 'bottom'
      });
  
      await toast.present();
    }

  // getAddress(){
  //   var first_name = this.signupForm.get('first_name').value;
  //   var middle_name = this.signupForm.get('middle_name').value;
  //   var last_name = this.signupForm.get('last_name').value;
  //   var birthdate = this.signupForm.get('birthdate').value;
  //   var address = this.signupForm.get('address').value;
  //   var phone_number = this.signupForm.get('phone_number').value;
 
  //   this.navCtrl.navigateForward(['/getaddress', { 
  //     email: this.email_var,
  //     first_name: first_name,
  //     middle_name: middle_name,
  //     last_name : last_name,
  //     birthdate:birthdate,
  //     phone_number:phone_number
  //   }]);

 
  
  // }

 
  checkPasswordSame(){
    var password = this.signupForm.get('password').value;
    var confirm_password = this.signupForm.get('confirm_password').value;

    if(password === confirm_password)
    {
      this.isPassSame = true;
    }
    else{
      this.isPassSame = false;
    }
  }

  // getAddressValue() {

  //   if(this.lat != null && this.lng != null){
  //   const accessToken = environment.mapbox.accessToken;
  //   const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.lng},${this.lat}.json?access_token=${accessToken}`;
  //   this.http.get(url).subscribe((res: any) => {
  //     if (res.features && res.features.length > 0) {
      
  //       console.log(res.features[0].place_name);
  //       this.signupForm.patchValue({
  //         address: res.features[0].place_name
  //       });
  //     } else {
  //       console.log('No address found.');
  //     }
  //   });
  // }
  
  // }

  async successAlert() {
    const alert = await this.alertController.create({
      header: 'Account Registration',
      subHeader: 'Success',
      message: 'Account registered successfully!',
      buttons: [{
        text:'OK',
        handler: async () =>{
          
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            }),
            observe: 'response' as const
          };

          let postData = {
            "auth_type": this.auth_type,
            "user_email": this.email_var,
            "user_password": this.password, 
            "user_ip": this.ipAddress,
         
          }

          if(this.auth_type === 'google'){
            postData['userID'] = this.userID
            postData['accessToken'] = this.accessToken
            postData['idToken'] = this.idToken
          }
          var errorcode = null;

           
            this.loading.present('Logging in'); 
            const response: HttpResponse<any> = await this.http.post('http://192.168.1.2:5000/login', postData, httpOptions).toPromise();
            errorcode = response.status
            console.log(response.statusText)
            this.loading.dismiss();
            if(response.status == 200){
              
              console.log(response.body.message)
              console.log('SESSIONID : '+response.body.sessionID)
              

              this.session.set('sessionID', response.body.sessionID)
              this.session.set('userID', response.body.userID)
              if(this.auth_type === 'google'){
                this.session.set('accessToken', response.body.accessToken);
                this.session.set('idToken', response.body.idToken);
              }
              
              this.router.navigate(['/home']);
            }
        }

    }],
    });

    await alert.present();
  }

  async getIPAddress() {

    // Use a public IP address API for web browsers
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    this.ipAddress = data.ip;

  console.log('IP address:', this.ipAddress);
}

}
