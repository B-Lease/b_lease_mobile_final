import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { BehaviorSubject, filter, from, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';

import {  HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';

const SESSION_KEY = 'sessionID'
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  API_URL = environment.API_URL;
  private _storage: Storage | null = null;
  private storageReady = new BehaviorSubject(false);
  constructor(
    private storage:Storage,
    private router:Router,
    private http:HttpClient,
    private navCtrl:NavController
    ) {
    this.init();
   }

  async init(){
    console.log('INIT');
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();
    const storage = await this.storage.create();
    this._storage = storage;
    // console.log('DONE');
    // this.storageReady.next(true);
  }

  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }
  async getSessionID() {
    const sessionID = await this._storage?.get('sessionID');
    return sessionID;
  }
  async getUserID() {
    const userID = await this._storage?.get('userID');
    return userID;
  }

  async checkLoginSession(){
    let sessionID_data = await this.getSessionID();
    let userID_data = await this.getUserID();


    // console.log(sessionID_data)
    // console.log(userID_data)
    if(sessionID_data === null || userID_data == null){
        console.log('NO SESSION PRESENT.')
    }
    else{ 

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          observe: 'response' as const
        };

       
        var errorcode = null;

      try{
        
        const response: HttpResponse<any> = await this.http.get(this.API_URL+'session?sessionID='+sessionID_data, httpOptions).toPromise();
        if(response.body.message === 'Session valid')
        {
          console.log('SESSION PRESENT. REDIRECTING...')
          this.router.navigate(['/home']);
        }
        else{
          console.log('NO SESSION PRESENT.')
        }
          
  
      }catch(error){
        console.log(error);
      }

    }
  }

  async logOutSession(){
    let sessionID_data = await this.getSessionID();
    let userID_data = await this.getUserID();
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      observe: 'response' as const
    };

    let putData = {
      "sessionID": sessionID_data,
      "userID": userID_data
    }
    var errorcode = null;

    try{
        

      const response: HttpResponse<any> = await this.http.put(this.API_URL+'session', putData, httpOptions).toPromise();
      if(response.body.message === 'Session expires')
      {
        console.log('SESSION INVALID.LOGGING OUT...')
        await this._storage?.clear();
        this.navCtrl.navigateRoot('/loginstart');
      } 
    }catch(error){
      console.log(error);
    }

    await this._storage?.clear();
    this.navCtrl.navigateRoot('/loginstart');

  }
  async checkSession(){
    let sessionID_data = await this.getSessionID();
    let userID_data = await this.getUserID();


    console.log(sessionID_data)
    console.log(userID_data)
    if(sessionID_data === null || userID_data === null){
      console.log('Session none. Logging out')
        this.logOutSession();
    }
    else{ 

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          observe: 'response' as const
        };

       
        var errorcode = null;

      try{
        
        const response: HttpResponse<any> = await this.http.get(this.API_URL+'session?sessionID='+sessionID_data, httpOptions).toPromise();
        if(response.body.message === 'Session valid')
        {
          console.log('SESSION VALID')
        }
        else{
          console.log('SESSION INVALID.LOGGING OUT...')
          await this._storage?.clear();
          this.navCtrl.navigateRoot('/loginstart');
        }
          
  
      }catch(error){
        console.log(error);
      }
      // this.router.navigate(['/home']);
    }
 
  }
  getData(){
    console.log('GET DATA');
    return this.storageReady.pipe(
      filter(ready => ready),
      switchMap(_=>{
        console.log('FETCHED');
        return from(this.storage.get(SESSION_KEY)) || of([]);
      })
    )
   
  }

  // async addData(item){
  //   const storedData = await this.storage.get(SESSION_KEY) || of([]);
  //   storedData.push(item);
  //   return this.storage.set(SESSION_KEY, storedData);
  // }

  // async removeItem(index){
  //   const storedData = await this.storage.get(SESSION_KEY) || of([]);
  //   storedData.splice(index,1);
  //   return this.storage.set(SESSION_KEY, storedData);
  // }
}
