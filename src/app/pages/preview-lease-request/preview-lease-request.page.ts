import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse  } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-preview-lease-request',
  templateUrl: './preview-lease-request.page.html',
  styleUrls: ['./preview-lease-request.page.scss'],
})

export class PreviewLeaseRequestPage implements OnInit {

  constructor(private http: HttpClient, private router:Router, private activatedroute: ActivatedRoute) {

  }

  ngOnInit() {
  }

  async loadPdfFromApi(): Promise<void> {
    const leasingID = [this.activatedroute.snapshot.queryParams['data']['leasingID']]
    const response = await this.http.get(`http://192.168.1.2:5000/leasingdocs?leasingID=${leasingID}`, { responseType: 'arraybuffer' }).toPromise();
    const pdfArrayBuffer = response as ArrayBuffer;
    const pdfUrl = this.createBlobUrlFromArrayBuffer(pdfArrayBuffer);
    const pdfViewer = document.getElementById('pdf-viewer') as HTMLObjectElement;
    pdfViewer.data = pdfUrl;
  }

  
  createBlobUrlFromArrayBuffer(arrayBuffer: ArrayBuffer): string {
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return url;
  }
  
  ionViewWillEnter() {
    this.loadPdfFromApi();
  }

  async deleteRecord(){
    // const formData = null
    // try {
    //   const response: HttpResponse<any> = await this.http.delete('http://127.0.0.1:5000/leasing', formData, { observe: 'response' }).toPromise();
    //   if(response.status === 201){
    //     console.log(response.status)
    //     this.router.navigate(['/preview-lease-request']);
    //   } else {

    //   }
    // } catch (error) {
    //   console.log(error);
    //   // Handle the error
    // }
  }
  

  

  
}








