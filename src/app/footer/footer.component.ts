import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  isDashboard:boolean = true;
  isInbox:boolean = false;
  isProfile:boolean = false;
  constructor(
  private navCtrl:NavController,
  private router:Router
  ) { }

  ngOnInit() {}
  async openInbox(){
    this.isDashboard = false;
    this.isInbox = true;
    this.isProfile = false;
     
     this.router.navigate(['/list-of-messages']);
    this.updateButtonColor();
    
  }
  
  async navigateProfile(){
    this.isDashboard = false;
    this.isInbox = false;
    this.isProfile = true;
   
     this.router.navigate(['/profile']);
    this.updateButtonColor();
    
  }
  
  async navigateDashboard(){
    this.isDashboard = true;
    this.isInbox = false;
    this.isProfile = false;
    
     this.router.navigate(['/dashboard']);
    this.updateButtonColor();
   
  }
  
  updateButtonColor() {
    const dashboardButton = document.getElementById('dashboard-button');
    const inboxButton = document.getElementById('inbox-button');
    const profileButton = document.getElementById('profile-button');
  
    dashboardButton.setAttribute('selected', this.isDashboard.toString());
    inboxButton.setAttribute('selected', this.isInbox.toString());
    profileButton.setAttribute('selected', this.isProfile.toString());
  }
}
