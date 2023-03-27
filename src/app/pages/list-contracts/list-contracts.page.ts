import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-list-contracts',
  templateUrl: './list-contracts.page.html',
  styleUrls: ['./list-contracts.page.scss'],
})
export class ListContractsPage implements OnInit {

  constructor(
    private navCtrl:NavController
  ) { }

  ngOnInit() {
  }

  navigateProfile(){
    this.navCtrl.navigateBack(['/home/profile']);
  }

}
