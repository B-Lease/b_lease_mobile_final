import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpResponse  } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { Platform } from '@ionic/angular';
import { isPlatform } from '@ionic/angular';
@Component({
  selector: 'app-preview-lease-request',
  templateUrl: './preview-lease-request.page.html',
  styleUrls: ['./preview-lease-request.page.scss'],
})

export class PreviewLeaseRequestPage implements OnInit {
  API_URL = environment.API_URL;
  constructor(
    private http: HttpClient, 
    private activatedroute: ActivatedRoute, 
    private documentViewer: DocumentViewer,
    private platform: Platform,
    private router: Router,
    ) {

  }

  ngOnInit() {

    this.openPdf()
  }

  // async loadPdfFromApi(): Promise<void> {
  //   //const leasingID = [this.activatedroute.snapshot.queryParams['data']['leasingID']]
  //   const leasingID = 'ebaba354691e34b29fec4276664b8ed8'
  //   const response = await this.http.get(this.API_URL+`leasingdocs?leasingID=${leasingID}`, { responseType: 'arraybuffer' }).toPromise();
  //   const pdfArrayBuffer = response as ArrayBuffer;
  //   const pdfUrl = this.createBlobUrlFromArrayBuffer(pdfArrayBuffer);
  //   const pdfViewer = document.getElementById('pdf-viewer') as HTMLObjectElement;
  //   pdfViewer.data = pdfUrl;
  // }
  
  createBlobUrlFromArrayBuffer(arrayBuffer: ArrayBuffer): string {
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return url;
  }

  async openPdf() {
    const fileUrl = '../assets/pdf/example.pdf'; // Replace with your PDF URL
    
    if (isPlatform('capacitor')){
            // Show error message
            console.log('Cordova is not available.');
            const leasingID = 'ebaba354691e34b29fec4276664b8ed8'
            const response = await this.http.get(this.API_URL+`leasingdocs?leasingID=${leasingID}`, { responseType: 'arraybuffer' }).toPromise();
            const pdfArrayBuffer = response as ArrayBuffer;
            const pdfUrl = this.createBlobUrlFromArrayBuffer(pdfArrayBuffer);
            const pdfViewer = document.getElementById('pdf-viewer') as HTMLObjectElement;
            pdfViewer.data = pdfUrl;
    } else {
      const options: DocumentViewerOptions = {
        title: 'My PDF'
      };
      this.documentViewer.viewDocument(fileUrl, 'application/pdf', options);

    }
  }
  

  async deleteRecord(){
    // const formData = null
    // try {
    //   const response: HttpResponse<any> = await this.http.delete(environment.API_URL+'leasing', formData, { observe: 'response' }).toPromise();
    //   if(response.status === 201){
    //     console.log(response.status)
    //     this.router.navigate(['/preview-lease-request']);
    //   } else {

    //   }
    // } catch (error) {
    //   console.log(error);
    //   // Handle the error
    // }
  }np
  
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
    this.router.navigate(['home']);
  }
  
}
