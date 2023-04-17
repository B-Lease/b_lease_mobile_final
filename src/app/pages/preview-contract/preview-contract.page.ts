import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';
import { IonInput } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
const IMAGE_DIR = 'stored-images/';
interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-preview-contract',
  templateUrl: './preview-contract.page.html',
  styleUrls: ['./preview-contract.page.scss'],
})
export class PreviewContractPage implements OnInit {
  
  pdfSrc: string = '';
  API_URL = environment.API_URL;
  
  propertyID:any;
  address:any;
  leasing_status:any;
  leasingID:any;

  button1 = ''
  button2 = ''
  button3 = ''

  display1 = true
  display2 = true
  display3 = true

  images: LocalFile[] = [];
  signbase64 = '';

  @ViewChild('signature') signature: IonInput;

  constructor(
    private activatedroute:ActivatedRoute,
    private http:HttpClient,
    private navCtrl:NavController,
    private alertController: AlertController,
    private platform: Platform,
    private ldingCtrl: LoadingController,
    private file: File,
    private fileOpener: FileOpener,
    private document: DocumentViewer
  ) {

    // pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    // pdfDefaultOptions.assetsFolder = '../www/assets/bleeding-edge';
  
    console.log(this.propertyID);
   }

   async ngOnInit() {
    // this.getPDF();
    this.propertyID = this.activatedroute.snapshot.paramMap.get('propertyID');
    this.address = this.activatedroute.snapshot.paramMap.get('address');
    this.leasing_status = this.activatedroute.snapshot.paramMap.get('leasing_status');
    this.leasingID = this.activatedroute.snapshot.paramMap.get('leasingID');

    if (this.leasing_status === 'ongoing'){
      this.display1 = false
      this.display2 = false
      this.display3 = false
    }
    else if (this.leasing_status === 'pending') {
      this.button1 = 'Sign'
      this.button2 = 'Reject'
      this.button3 = 'Approve'
    }
    else if(this.leasing_status === 'finished'){
      this.button1 = 'Rate'
      this.button2 = 'Finished'
      this.button3 = 'Renew'      
    }
  }

  async checkSignature(){
    const value = this.signature.value;
    console.log('value '+value)
    if (value === null || value == undefined){
      const alert = await this.alertController.create({
        header: 'Oops!',
        subHeader: 'One more requirement..',
        message: 'Please upload your signature first.',
        buttons: ['OK'],
      });

      await alert.present();
    } else {
      this.approveContract();
    }
  }

  async approveContract(){
    const alert = await this.alertController.create({
      header: 'Success!',
      subHeader: 'Contract approved successfully',
      message: 'Please wait 1-2 business days for the admin to approve your contract',
      buttons: ['OK'],
    });

    try {
      const formData = {
        leasingID: this.leasingID,
        leasing_status: '1'
      }
      const response: HttpResponse<any> = await this.http.put(`${environment.API_URL}leasingstatus?leasingID=${this.leasingID}&leasing_status=1`, formData, { observe: 'response' }).toPromise();
      if(response.status === 201){
        console.log(response.status)
        await alert.present();
        
      } else {

      }
    } catch (error) {
      console.log(error);
      // Handle the error
    }

  }

  async declineContract(){
    const alert = await this.alertController.create({
      header: 'Rejected contract',
      subHeader: 'Your contract has been declined.',
      buttons: ['OK'],
    });

    try {
      const formData = {
        leasingID: this.leasingID,
        leasing_status: '1'
      }
      const response: HttpResponse<any> = await this.http.put(`${environment.API_URL}leasingstatus?leasingID=${this.leasingID}&leasing_status=2`, formData, { observe: 'response' }).toPromise();
      if(response.status === 201){
        console.log(response.status)
        await alert.present();
        
      } else {

      }
    } catch (error) {
      console.log(error);
      // Handle the error
    }

  }

  async openWordContract(){
    const url = this.API_URL+`leasingdocs?leasingID=${this.leasingID}`
  
    // Get the ArrayBuffer from the HTTP response
    const arrayBuffer = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();

    // Create a temporary file in the data directory
    const fileName = 'temp.docx';
    const filePath = this.file.dataDirectory + fileName;


    if (this.platform.is('android')) {
      await this.file.writeFile(this.file.dataDirectory, fileName, arrayBuffer, { replace: true });

      // Open the file with the file opener plugin
      this.fileOpener.open(filePath, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        .then(() => console.log('File opened successfully'))
        .catch(e => console.log('Error opening file', e));


    } else {
      const options: DocumentViewerOptions = {
        title: 'My Leasing Contract'
      }
      this.document.viewDocument(`${filePath}/${fileName}`,'application/vnd.openxmlformats-officedocument.wordprocessingml.document', options)
    }

  }

  async selectImage() {
    console.log('upload')
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });
    console.log(image);
    if (image) {
      this.saveImage(image);
    }
  }

  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}${fileName}`,
      data: base64Data
    });
    console.log('saved: ', savedFile);
    this.loadFiles();
  }

  async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path
      });
      return file.data;
    }
    else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);

    };
    reader.readAsDataURL(blob);
  });

  async loadFiles() {
    this.images = [];

    const loading = await this.ldingCtrl.create({
      message: "Loading Images...",
    });
    await loading.present();

    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR,
    })
      .then((result) => {
        console.log("HERE ", result);
        this.LoadFileData(result.files);
      })
      .catch(async (err) => {
        console.log("err: ", err);
        await Filesystem.mkdir({
          directory: Directory.Data,
          path: IMAGE_DIR,
        });
      })
      .then((_) => {
        loading.dismiss();
      });
  }

  async LoadFileData(fileInfos: FileInfo[]) {
    for (let fileInfo of fileInfos) {
      const filePath = `${IMAGE_DIR}${fileInfo.name}`;

      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath,
      });
      this.images.push({
        name: fileInfo.name,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`
      });
      console.log("READ: ", readFile);
      this.signbase64 = readFile.data;

    }
  }

  async deleteImage(file: LocalFile) {
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: file.path
    });
    this.loadFiles();

  }



  // getPDF() {
  //   this.http.get(this.API_URL+'leasingdocs/48a089ac5b003f70bfb38e5590c14035/2d1026c114023569a611afbd8ed1ebde_contract.pdf', { responseType: 'blob' })
  //     .subscribe((response: any) => {
  //       const blob = new Blob([response], { type: 'application/pdf' });
  //       this.pdfSrc = URL.createObjectURL(blob);
  //     }, error => {
  //       console.log(error);
  //     });
  // }
  navigateMyContracts(){
    this.navCtrl.navigateBack(['/list-contracts']);
  }

  navigateRate(){
    if (this.button1 == 'Sign'){
      this.selectImage()
    } else {
      this.navCtrl.navigateForward([
        '/rate',
        {
          propertyID:this.propertyID,
          address:this.address,
        }
      ])
    }
  }

}
