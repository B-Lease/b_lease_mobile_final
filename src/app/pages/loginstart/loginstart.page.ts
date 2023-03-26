import { Component, OnInit } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoadingService } from 'src/app/shared/loading.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/shared/session.service';
@Component({
  selector: 'app-loginstart',
  templateUrl: './loginstart.page.html',
  styleUrls: ['./loginstart.page.scss'],
})
export class LoginstartPage implements OnInit {
  user = null;
  token: any;
  ipAddress:any;
 
  constructor(
    private http:HttpClient,
    private loading:LoadingService,
    private navCtrl:NavController,
    private router:Router,
    private session:SessionService

  ) {
    this.getIPAddress();
    if (!isPlatform('capacitor')){
      GoogleAuth.initialize();
    }
   }

  ngOnInit() {
  }

  async googleSignIn() {
    this.user = await GoogleAuth.signIn();
    console.log('user: ',this.user);

    // console.log(this.user.authentication.accessToken);
    // console.log(this.user.authentication.idToken);
    // console.log(this.user.authentication.refreshToken);
    // console.log(this.user.email);
    // console.log(this.user.givenName);
    // console.log(this.user.familyName);
    // console.log(this.user.id);
    // console.log(this.user.imageUrl);
    this.checkExistingAccount();
  }

  // async refresh(){
  //   const authCode = await GoogleAuth.refresh();
  //   console.log('refresh: ',authCode);
  // }




  async checkExistingAccount(){
    try {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      const data = await this.http.get('http://192.168.1.2:5000/login' + '?userID='+this.user.id, { headers }).toPromise();
  
      // this.userData = JSON.parse(data.toString());
      
      if(data['message'] != null){
        if(data['message'] === 'User not found')
        {
          console.log('Need registration');
          this.navCtrl.navigateForward(['/signup',{
            'accessToken':this.user.authentication.accessToken,
            'idToken':this.user.authentication.idToken,
            'email': this.user.email,
            'givenName':this.user.givenName,
            'familyName': this.user.familyName,
            'userID':this.user.id,
            'imageUrl':this.user.imageUrl,
            'auth_type':'google'
          }])
        }
    
      }
      else{
        console.log('Registered')

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          observe: 'response' as const
        };

        let postData = {
          "auth_type": "google",
          "user_email": this.user.email,
          "user_ip": this.ipAddress,
          "userID":this.user.id,
          "accessToken":this.user.authentication.accessToken,
          "idToken":this.user.authentication.idToken,
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
            this.session.set('accessToken', response.body.accessToken);
            this.session.set('idToken', response.body.idToken);
           
            
            this.router.navigate(['/dashboard']);
          }
      }

    } catch (error) {
      console.error(error);
    }
   

    
  }

  async getIPAddress() {

    // Use a public IP address API for web browsers
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    this.ipAddress = data.ip;

  console.log('IP address:', this.ipAddress);
}

signupStart(){
  this.navCtrl.navigateForward(['/signupstart'])
}

}
