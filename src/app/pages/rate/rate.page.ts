import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/shared/session.service';

import { LoadingService } from 'src/app/shared/loading.service';

import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-rate',
  templateUrl: './rate.page.html',
  styleUrls: ['./rate.page.scss'],
})
export class RatePage implements OnInit {
  userID:any;
  sessionID:any;
  propertyID:any;
  address:any;

  constructor(
    private activatedroute:ActivatedRoute,
    private session:SessionService,
    private navCtrl:NavController
  ) { }

  async ngOnInit() {
    await this.session.init();
    await this.getSessionData();


    this.address = this.activatedroute.snapshot.paramMap.get('address');
    this.propertyID = this.activatedroute.snapshot.paramMap.get('propertyID');
  
  }


  async getSessionData() {
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : ' + sessionID_data);
    console.log('USER ID : ' + userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;
  }

   navigatePreviewContract(){
    this.navCtrl.navigateForward(['/preview-contract',
    {
      propertyID:this.propertyID,
      address: this.address
    }
  ]);
   }


}
