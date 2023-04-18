import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-complaint-thread',
  templateUrl: './complaint-thread.page.html',
  styleUrls: ['./complaint-thread.page.scss'],
})
export class ComplaintThreadPage implements OnInit {
  API_URL = environment.API_URL;
  response: any[];
  ticket: any[];
  constructor(private router: Router, private http: HttpClient, private activatedroute: ActivatedRoute) { }

  async ngOnInit() {
    const leasingID = this.activatedroute.snapshot.queryParams['data']['complaintID'];
    console.log(leasingID)
    const ticket = await this.http.get(this.API_URL+`complaints?leasingID=${leasingID}`).subscribe((data) => {
      if (typeof data === 'string') {
        this.ticket = JSON.parse(data);
        console.log(this.ticket)
      } else {
        this.ticket = Object.values(ticket);
        console.log(this.ticket)
      }
    });

    const response = await this.http.get(this.API_URL+`complaintThread?leasingID=${leasingID}`).subscribe((data) => {
      if (typeof data === 'string') {
        this.response = JSON.parse(data);
        console.log(this.response)
      } else {
        this.response = Object.values(data);
        console.log(this.response)
      }
    });
  }

  goBack(){
    console.log('okay')
    this.router.navigate(['/home'])
  }

}
