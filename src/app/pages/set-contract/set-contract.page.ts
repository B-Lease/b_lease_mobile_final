import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-set-contract',
  templateUrl: './set-contract.page.html',
  styleUrls: ['./set-contract.page.scss'],
})

export class SetContractPage implements OnInit {
  form_lease: FormGroup;
  isFirstToggleOn = false;
  isSecondToggleOn = false;
  isThirdToggleOn = false;
  
  
  constructor(public fb_lease: FormBuilder, private http:HttpClient, private router: Router, private activatedroute: ActivatedRoute, private navCtrl: NavController) {
    console.log(this.activatedroute.snapshot.queryParams['data']['leasingID']);
    this.form_lease = this.fb_lease.group({
      leasingID : [this.activatedroute.snapshot.queryParams['data']['leasingID']],
      purpose: [''],
      leasing_status: ['open'],
      leasing_start: [''],
      leasing_end: [''],
      leasing_payment_frequency: [''],
      leasing_total_fee: [''],
      security_deposit: [false],
      improvements: [false],
      erect_signage: [false],
    });


  }

  ngOnInit() {

  }


  
  async onSubmit() {
    var formData: any = new FormData();
    formData.append('leasingID', this.form_lease.get('leasingID').value);
    formData.append('purpose', this.form_lease.get('purpose').value);
    formData.append('leasing_status', this.form_lease.get('leasing_status').value);
    formData.append('leasing_start', this.form_lease.get('leasing_start').value);
    formData.append('leasing_end', this.form_lease.get('leasing_end').value);
    formData.append('leasing_total_fee', this.form_lease.get('leasing_total_fee').value);
    formData.append('leasing_payment_frequency', this.form_lease.get('leasing_payment_frequency').value);
    formData.append('security_deposit', this.form_lease.get('security_deposit').value);
    formData.append('improvements', this.form_lease.get('improvements').value);
    formData.append('erect_signage', this.form_lease.get('erect_signage').value);

    try {
      const response: HttpResponse<any> = await this.http.put('http://127.0.0.1:5000/leasing', formData, { observe: 'response' }).toPromise();
      if(response.status === 204){
        
        const data = {
          leasingID : [this.activatedroute.snapshot.queryParams['data']['leasingID']]
        }
        this.navCtrl.navigateForward('preview-lease-request', { queryParams: { data } });
      } else {

      }
    } catch (error) {
      console.log(error);
      // Handle the error
    }

  }


  toggleChanged() {
    if (this.isFirstToggleOn) {  
      this.isFirstToggleOn = true;
    } else {
      this.isFirstToggleOn = false;
    }

    if (this.isSecondToggleOn) {
      this.isSecondToggleOn = true;
    } else {
      this.isSecondToggleOn = false;
    }

    if (this.isThirdToggleOn) {
      this.isThirdToggleOn = true;
    } else {
      this.isThirdToggleOn = false;
    }
  }

}
