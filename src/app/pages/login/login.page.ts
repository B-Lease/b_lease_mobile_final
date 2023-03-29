import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router,ActivatedRoute } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { Platform } from '@ionic/angular';
import {  HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AlertController, LoadingController, ToastController,NavController } from '@ionic/angular';
import { LoadingService } from 'src/app/shared/loading.service';
import { SessionService } from 'src/app/shared/session.service';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{
  loginForm: FormGroup;
  pwdIcon = "eye-outline";
  showPwd = false;
  ipAddress: any;

  sessionData = [];

  constructor(
    private formBuilder: FormBuilder,
    private network: Network,
    private networkInterface: NetworkInterface,
    private platform: Platform,
    private toastController:ToastController,
    private http:HttpClient,
    private loading:LoadingService,
    private router:Router,
    private session:SessionService,
    private navCtrl:NavController,
    private alertController:AlertController
 

    
    ) {
    // this.loadSession();
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.compose([Validators.required])],
      password: ["", Validators.required],
    });
    this.getIPAddress();
  }

  // async loadSession(){
  //   // this.sessionData = await this.session.getData();
  //   await this.session.getData().subscribe(res =>{
  //     console.log(this.sessionData)
  //     this.sessionData = res;
  //   });
  
  // }

  // async addSession(sessionID){
  //   await this.session.addData(sessionID);
  //   this.loadSession();
  // }
  // async removeSession(index){
  //   this.session.removeItem(index);
  //   this.sessionData.splice(index,1);
  // }

  togglePwd() {
    this.showPwd = !this.showPwd;
    this.pwdIcon = this.showPwd ? "eye-off-outline" : "eye-outline";
  }
  
  async ngOnInit(){
    
    await this.session.init();
    await this.session.checkLoginSession();

    
  }

  ngAfterInit(){
  
  }


  async getIPAddress() {

      // Use a public IP address API for web browsers
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      this.ipAddress = data.ip;
  
    console.log('IP address:', this.ipAddress);
  }

  async login(){
    console.log(this.loginForm)
    var email = this.loginForm.get('email').value;
    var password = this.loginForm.get('password').value;



    if(email && password && this.ipAddress)
    {
        if(this.isValid(email)){
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            }),
            observe: 'response' as const
          };

          let postData = {
            "user_email": email,
            "user_password": password, 
            "user_ip": this.ipAddress,
            "auth_type":'email'
        
          }
          var errorcode = null;

            try{
            this.loading.present('Logging in');
            const response: HttpResponse<any> = await this.http.post(environment.API_URL+'login', postData, httpOptions).toPromise();
            errorcode = response.status
            console.log(response.statusText)
            this.loading.dismiss();
            if(response.body.message == 'Login'){
              console.log(response.body.message)
              console.log('SESSIONID : '+response.body.sessionID)
              

              await this.session.set('sessionID', response.body.sessionID)
              await this.session.set('userID', response.body.userID)
              await this.router.navigate(['/home']);
            }

            if (response.body.message == 'User Deactivated. Login')
            {
              console.log(response.body.message)
              console.log('SESSIONID : '+response.body.sessionID)
              

              this.session.set('sessionID', response.body.sessionID)
              this.session.set('userID', response.body.userID)
              await this.deactivateLogin();
              await this.router.navigate(['/home']);

              // await this.navCtrl.navigateForward(['/dashboard'])
            }
            if(response.body.message != 'Login' && response.body.message != 'User Deactivated. Login' ){
                
                await this.invalidLogin();
            }
 
           
          
          } catch(error){
            console.log(error);
            await this.invalidLogin();
                      
          }
        }
        else{
          await this.emailInvalidToast(); 
        }
    }
    else{
    
        await this.completeFieldsToast();
    
    }
  }
 
  async completeFieldsToast() {
    const toast = await this.toastController.create({
      message: 'Please fill out the fields.',
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }
  isValid(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
    }
  
    async emailInvalidToast() {

      var message = "You have entered an invalid email.";
    
  
      const toast = await this.toastController.create({
      
        message: message,
        duration: 3000,
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel',
            handler: () => { }
          }
        ]
      });
  
      await toast.present();
  
      const { role } = await toast.onDidDismiss();
    
    }

    async invalidLogin() {
      const toast = await this.toastController.create({
        message: 'Invalid Log In',
        duration: 3000,
        position: 'bottom'
      });
  
      await toast.present();
    }

    async deactivateLogin() {
      const alert = await this.alertController.create({
        header: 'Welcome Back',
        subHeader: '',
        message: 'You have recently deactivated. Welcome back!',
        buttons: ['OK'],
      });
  
      await alert.present();
    }

    

  
}
