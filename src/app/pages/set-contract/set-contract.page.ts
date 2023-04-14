import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { LoadingService } from 'src/app/shared/loading.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem';
import { LoadingController, NavController, Platform } from '@ionic/angular';

const IMAGE_DIR = 'stored-images';
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
  leasing_start:''
  leasing_end: ''
  leasing_payment_frequency: ''
  leasing_total_fee: ''

  isFirstToggleOn = false;
  isSecondToggleOn = false;
  isThirdToggleOn = false;

  images: LocalFile[] = [];

  signbase64 = '';
  data: any;
  constructor(
    public fb_lease: FormBuilder, 
    private http:HttpClient, 
    private router: Router, 
    private activatedroute: ActivatedRoute,
    private loadingCtrl: LoadingService,
    private platform: Platform,
    private ldingCtrl: LoadingController,
    private navCtrl: NavController
    ) {
  }

  ngOnInit() {
    this.data = this.activatedroute.snapshot.queryParams['data'];
    console.log(this.data)
  }



  async clearImages(){
    for (let i = 0; i < this.images.length; i++) {
    
      const response = await fetch(this.images[i].data);
      this.deleteImage(this.images[i]);
      console.log(response);
      const blob = await response.blob();

    }
  }
  
  async onSubmit() {
    this.clearImages()
    await this.loadingCtrl.present('Creating Lease Contract..')
    const data = this.data;
    console.log(data)
    const formData = {
      'leasingID' : data['leasingID'],
      'leasing_status': 'pending',
      'leasing_start': this.leasing_start,
      'leasing_end': this.leasing_end,
      'leasing_payment_frequency': this.leasing_payment_frequency,
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
        await this.navCtrl.navigateForward('preview-lease-request', { queryParams: { data } });
        await this.loadingCtrl.dismiss()
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

  //FOR IMAGE UPLOAD
  async selectImage() {
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
    console.log(base64Data);

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
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
      const filePath = `${IMAGE_DIR}/${fileInfo.name}`;

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

  goBack() {
    this.clearImages();
    const data = this.activatedroute.snapshot.queryParams['data'];
    this.navCtrl.navigateBack('chatroom', { queryParams: { data } });
  }

}
