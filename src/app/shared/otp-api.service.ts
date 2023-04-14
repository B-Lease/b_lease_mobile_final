import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class OtpApiService {

  apiURL = environment.API_URL;

  verifiedOTP = null;
  httpOptions = {
    headers: new HttpHeaders({
      'Accept':'application/json',
      'Content-Type': 'application/json',
    }),
  };
  constructor(private http:HttpClient) { }
  

   // HttpClient API post() method => Create OTP
  async createOTP(email:any){
    

    let postData = {
      "email":email
    }
    
    return await this.http.post(this.apiURL+"register", postData).toPromise();
  }

  expireOTP(email)
  {
    var isSuccess = false;
    return this.http.delete(this.apiURL+"register?email="+email)  .subscribe(data => {
      isSuccess = true
     }, error => {
      isSuccess
      console.log(error);
    });
  }

  verifyOTP(otp,email)
  {
    var response;
    


    
  //   var response
  //    return this.http.get(this.apiURL+"/register?email="+email+"&otp="+otp)  .subscribe(data => {
    
  //     response = data['message']
  //    }, error => {
  //     console.log(error);
  //   });

  //  return response;
  }
}
