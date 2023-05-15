import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { LoadingService } from 'src/app/shared/loading.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
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
  selector: 'app-set-contract',
  templateUrl: './set-contract.page.html',
  styleUrls: ['./set-contract.page.scss'],
})


export class SetContractPage implements OnInit {
  // form_lease: FormGroup;

  purpose: ''
  leasing_start:any
  leasing_end: ''
  leasing_payment_frequency: ''
  leasing_total_fee: ''
  leasing_payment_type: ''

  isFirstToggleOn = false;
  isSecondToggleOn = false;
  isThirdToggleOn = false;

  images: LocalFile[] = [];
  signbase64 = '';
  API_URL = environment.API_URL;
  data: any;

  constructor(
    public fb_lease: FormBuilder, 
    private http:HttpClient, 
    private activatedroute: ActivatedRoute,
    private loadingCtrl: LoadingService,
    private platform: Platform,
    private ldingCtrl: LoadingController,
    private navCtrl: NavController,
    private file: File,
    private fileOpener: FileOpener,
    private document: DocumentViewer,
    private alertController: AlertController,
    private router: Router
    ) {

      this.leasing_start = new Date().toISOString().slice(0, 10);
  }

  ngOnInit() {
    this.data = this.activatedroute.snapshot.queryParams['data'];
    console.log(this.data)
  }


  goBack() {
    this.clearImages();
    const data = this.activatedroute.snapshot.queryParams['data'];
    this.navCtrl.navigateBack('chatroom', { queryParams: { data } });
  }

  clearImages(){
    for (let i = 0; i < this.images.length; i++) {
      this.deleteImage(this.images[i]);
    }
  }


  async onSubmit(){

    if (this.purpose == undefined || this.leasing_payment_type == undefined || this.leasing_total_fee == undefined || this.leasing_start == undefined || this.leasing_end == undefined || this.leasing_payment_frequency == undefined){
      const sign = await this.alertController.create({
        header: 'Oops!',
        subHeader: 'One or more fields are missing.',
        message: 'Please input the necessary details.',
        buttons: ['OK'],
      });

      await sign.present();
    } 
    else {
      const alert = await this.alertController.create({
        header: 'Leasing Confirmation',
        subHeader: 'Confirm lease request?',
        message: 'Once you set a contract, you will not be able to edit it.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => { }
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => { this.confirmLeaseRequest() }
          }
        ],
      });
  
      await alert.present();
    }



  }
  
  async confirmLeaseRequest() {
    const data = this.activatedroute.snapshot.queryParams['data'];
    if (this.signbase64 === '' || this.images.length<1){
      const sign = await this.alertController.create({
        header: 'Oops!',
        subHeader: 'One more requirement..',
        message: 'Please upload your signature first.',
        buttons: ['OK'],
      });

      await sign.present();
    } else {
      const formData = {
        'leasingID' : data['leasingID'],
        'leasing_status': 'pending',
        'leasing_start': this.leasing_start,
        'leasing_end': this.leasing_end,
        'leasing_payment_frequency': this.leasing_payment_frequency,
        'leasing_payment_type': this.leasing_payment_type,
        'leasing_total_fee': this.leasing_total_fee,

        'lessorID': data['lessorID'],
        'lessor_name' : data['lessor_fname'] + ' ' + data['lessor_mname'] + ' ' + data['lessor_lname'],
        'lesseeID' : data['lesseeID'],
        'lessee_name' : data['lessee_fname'] + ' ' + data['lessee_mname'] + ' ' + data['lessee_lname'],
        'address' : data['address'],
        'land_description' : data['land_description'],

        'purpose': this.purpose,
        'security_deposit': this.isFirstToggleOn,
        'improvements': this.isSecondToggleOn,
        'erect_signage': this.isThirdToggleOn,
        'signature': this.signbase64,
      };

      try {
        const response: HttpResponse<any> = await this.http.put(`${environment.API_URL}leasing`, formData, { observe: 'response' }).toPromise();
        if(response.status === 204){
          console.log(response.status)
          const data = {
            'leasingID': this.activatedroute.snapshot.queryParams['data']['leasingID']
          }
          //await this.navCtrl.navigateForward('preview-lease-request', { queryParams: { data } });
          this.openWordContract() 
          this.router.navigate(['/home'])
        } else {

        }
      } catch (error) {
        console.log(error);
        // Handle the error
      }

      this.clearImages()
    }
  }

  onDateChanged() {
    console.log('HELLOOOO')
    console.log(this.leasing_end)
    console.log(this.leasing_start)

    
  }

  onStartDateChanged() {
    console.log('HELLOOOO')
    console.log(this.leasing_end)
    console.log(this.leasing_start)

    const selectedDate = new Date(this.leasing_start);
    const leasing_start = new Date();
  
    if (selectedDate < leasing_start) {
      this.leasing_start = (leasing_start.toISOString().slice(0, 10)).toString();
    }

    
  }
  

  async openWordContract(){
    const leasingID = this.activatedroute.snapshot.queryParams['data']['leasingID'];
    const url = this.API_URL+`leasingdocs?leasingID=${leasingID}`
  
    // Get the ArrayBuffer from the HTTP response
    const arrayBuffer = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();

    // Create a temporary file in the data directory
    const fileName = 'Lease Contract.docx';
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

  //FOR IMAGE UPLOAD
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
    this.images = this.images.filter((item) => item !== file);
    this.loadFiles();

  }



}
