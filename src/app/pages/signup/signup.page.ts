import {  HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from "@angular/forms";
import { Router,ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LoadingService } from 'src/app/shared/loading.service';

import { AlertController, LoadingController, ToastController } from '@ionic/angular';





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

  isPassSame: boolean = true;

  isPassStrong: boolean = false;

  isPassCheck = '';

  public email_var;

  constructor(private formBuilder: FormBuilder,  private activatedroute:ActivatedRoute, private alertController:AlertController,
    public router:Router, private toastController: ToastController, private http:HttpClient,
    public loading: LoadingService
    ) {
  
  
    //   this.signupForm = this.formBuilder.group({
    //   first_name: ["", Validators.required],
    //   middle_name: ["", Validators.required],
    //   last_name: ["", Validators.required],
    //   birthdate: ["", Validators.required],
    //   address: ["", Validators.required],
    //   password: ["", Validators.required],
    //   confirm_password: ["", Validators.required],
    //   agree_terms: ["", Validators.required],
    // });

    
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
    this.email_var = this.activatedroute.snapshot.paramMap.get('email')
    this.signupForm = this.formBuilder.group({
      first_name : new FormControl(null, [Validators.required, Validators.minLength(1)]),
      middle_name : new FormControl(null),
      last_name : new FormControl(null, Validators.required),
      birthdate : new FormControl(null, Validators.required),
      address : new FormControl(null, Validators.required),
      phone_number : new FormControl(null, Validators.required),
      password : new FormControl(null, Validators.required),
      confirm_password : new FormControl(null, Validators.required),
      check_agree: [false]
    }
    );
  
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
      var address = this.signupForm.get('address').value;
      var phone_number = this.signupForm.get('phone_number').value;
      var password = this.signupForm.get('password').value;
      var confirm_password = this.signupForm.get('confirm_password').value;
      
      console.log(birthdate);
      if(first_name && last_name && birthdate && address && phone_number && password && confirm_password)
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
                "address": address,
                "latitude": '0',
                "longitude": '0',
              }
              var errorcode = null;
              // return await this.http.post('http://192.168.1.2:5000'+"/register", postData).toPromise();
                try{
                this.loading.present('Registering Account');
                const response: HttpResponse<any> = await this.http.post('http://192.168.1.2:5000/user', postData, httpOptions).toPromise();
                errorcode = response.status
                console.log(response.statusText)
                if(response.status == 200){
                  console.log(response.body.message)
                  this.loading.dismiss();
                  this.router.navigate(['/dashboard']);
                }
     
               
              
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

  getAddress(){
    this.router.navigate(['google-map-get-address']);
  }

 
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


}
