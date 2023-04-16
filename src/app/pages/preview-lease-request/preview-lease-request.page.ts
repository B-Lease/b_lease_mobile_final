import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpResponse  } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { Platform } from '@ionic/angular';
import { isPlatform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

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
    private file: File,
    private fileOpener: FileOpener,
    private document: DocumentViewer,
    ) {

  }

  ngOnInit() {
    this.openLocalPdf()
  }

  
  createBlobUrlFromArrayBuffer(arrayBuffer: ArrayBuffer): string {
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return url;
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
  }
  
  async openLocalPdf(){
    const leasingID = 'ebaba354691e34b29fec4276664b8ed8'
    const url = this.API_URL+`leasingdocs?leasingID=${leasingID}`
  
    // Get the ArrayBuffer from the HTTP response
    const arrayBuffer = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();

    // Create a temporary file in the data directory
    const fileName = 'temp.pdf';
    const filePath = this.file.dataDirectory + fileName;

    if (this.platform.is('android')) {
      await this.file.writeFile(this.file.dataDirectory, fileName, arrayBuffer, { replace: true });

      // Open the file with the file opener plugin
      this.fileOpener.open(filePath, 'application/pdf')
        .then(() => console.log('File opened successfully'))
        .catch(e => console.log('Error opening file', e));

    } else {
      const options: DocumentViewerOptions = {
        title: 'MyPDF'
      }
      this.document.viewDocument(`${filePath}/${fileName}.pdf`,'application/pdf', options)
    }

  }
    
}

