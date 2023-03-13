import { Component, OnInit } from '@angular/core';
import {  HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from "@angular/forms";
import { Router,ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LoadingService } from 'src/app/shared/loading.service';

import { AlertController, LoadingController, ToastController } from '@ionic/angular';

import { SessionService } from 'src/app/shared/session.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {
  passwordForm: FormGroup;
  pwdIcon = "eye-outline";
  showPwd = false;

  confirm_pwdIcon = "eye-outline";
  confirm_showPwd = false;
  isChecked: boolean = false;
  ageIsValid: boolean = true;

  isPassSame: boolean = true;

  isPassStrong: boolean = false;

  isPassCheck = '';

  userID:any;
  sessionID:any;

  constructor(
    private formBuilder: FormBuilder,  private activatedroute:ActivatedRoute, private alertController:AlertController,
    public router:Router, private toastController: ToastController, private http:HttpClient,
    public loading: LoadingService, private session:SessionService
  ) {

    this.passwordForm = this.formBuilder.group({
      password : new FormControl(null, Validators.required),
      confirm_password : new FormControl(null, Validators.required),
    }
    );
   }

  async ngOnInit() {

    await this.session.init();
    await this.session.checkSession();
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

  togglePwd() {
    this.showPwd = !this.showPwd;
    this.pwdIcon = this.showPwd ? "eye-off-outline" : "eye-outline";
  }
  toggleConfirmPwd() {
    this.confirm_showPwd = !this.confirm_showPwd;
    this.confirm_pwdIcon = this.confirm_showPwd ? "eye-off-outline" : "eye-outline";
  }

  public validateAreEqual(fieldControl: FormControl) {
    return fieldControl.value === this.passwordForm.get("password").value ? null : {
        NotEqual: true
    };
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


checkPasswordStrength(){
  var password = this.passwordForm.get("password").value;
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

async onSubmit(){
  console.log(this.passwordForm)


  



    var password = this.passwordForm.get('password').value;
    var confirm_password = this.passwordForm.get('confirm_password').value;
    


      if(password === confirm_password){
        if(this.isPassStrong){
        
          if(this.ageIsValid){
            const httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json'
              }),
              observe: 'response' as const
            };
            let postData = {
              "sessionID":this.sessionID,
              "userID":this.userID,
              "user_password": password, 

            }

            var errorcode = null;
            // return await this.http.post('http://192.168.1.2:5000'+"/register", postData).toPromise();
            try {
              await this.loading.present('Changing Password');
              const response: HttpResponse<any> = await this.http.post('http://192.168.1.2:5000/changepassword', postData, httpOptions).toPromise();
      
              if(response.body.message === 'passwordchanged')
              {
                await this.loading.dismiss();
                await this.router.navigate(['/settings']);
              }
        




            } catch (error) {
              console.log(error);

            }
          }
        }
        else{
          this.passnotstrongToast();
        }
       
            
      }
      else{
      
          this.incorrectPassToast();
      
   
      
      }
   
          
  }

async passnotstrongToast() {
  const toast = await this.toastController.create({
    message: 'Your password is not strong enough. Your password should contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters.',
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

checkPasswordSame() {
  var password = this.passwordForm.get('password').value;
  var confirm_password = this.passwordForm.get('confirm_password').value;

  if (password === confirm_password) {
    this.isPassSame = true;
  }
  else {
    this.isPassSame = false;
  }
}

}
