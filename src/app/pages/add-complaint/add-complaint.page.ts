import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-add-complaint',
  templateUrl: './add-complaint.page.html',
  styleUrls: ['./add-complaint.page.scss'],
})
export class AddComplaintPage implements OnInit {
  API_URL = environment.API_URL;
  complaint_subject = ''
  complaint_desc = ''
  constructor(private http: HttpClient, private activatedroute: ActivatedRoute, private alertController: AlertController, private router: Router) { }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/list-contracts'])
  }

  async onSubmit(){
    const data = this.activatedroute.snapshot.queryParams['data'];
    const currentDate: Date = new Date();
    const formData = {
      'complaintID': data['complaintID'],
      'complaint_subject': this.complaint_subject,
      'complaint_desc': this.complaint_desc,
      'complainerID': data['complainerID'],
      'complaineeID': data['complaineeID'],
      'complaint_status': 'pending',
      'created_at': currentDate
    };

    try {
      const response: HttpResponse<any> = await this.http.post(`${this.API_URL}complaints`, formData, { observe: 'response' }).toPromise();
      if(response.status === 204){
        console.log(response.status)
        const alert = await this.alertController.create({
          header: 'Complaint Filed!',
          subHeader: 'We are sorry for your inconvenience',
          message: 'We will fix on this as soon as possible',
          buttons: ['OK'],
        });

        await alert.present();

        this.router.navigate(['/list-contracts'])
      } else {

      }
    } catch (error) {
      console.log(error);
      // Handle the error
    }
  }

}
