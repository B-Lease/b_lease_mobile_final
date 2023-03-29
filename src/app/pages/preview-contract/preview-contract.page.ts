import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-preview-contract',
  templateUrl: './preview-contract.page.html',
  styleUrls: ['./preview-contract.page.scss'],
})
export class PreviewContractPage implements OnInit {
  
  pdfSrc: string = '';
  API_URL = environment.API_URL;
  leasingID:any;
  address:any;
  constructor(
    private activatedroute:ActivatedRoute,
    private http:HttpClient,
    private navCtrl:NavController
  ) {

    // pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    pdfDefaultOptions.assetsFolder = '../www/assets/bleeding-edge';
    this.leasingID = this.activatedroute.snapshot.paramMap.get('propertyID');
    this.address = this.activatedroute.snapshot.paramMap.get('address');
    console.log(this.leasingID);
   }

   ngOnInit() {
    this.getPDF();
  }

  getPDF() {
    this.http.get(this.API_URL+'leasingdocs/48a089ac5b003f70bfb38e5590c14035/2d1026c114023569a611afbd8ed1ebde_contract.pdf', { responseType: 'blob' })
      .subscribe((response: any) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        this.pdfSrc = URL.createObjectURL(blob);
      }, error => {
        console.log(error);
      });
  }
  navigateMyContracts(){
    this.navCtrl.navigateBack(['/list-contracts']);
  }

}
