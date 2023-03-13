import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';

import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem';
import { LoadingController, Platform } from '@ionic/angular';
import { finalize } from 'rxjs';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { SessionService } from 'src/app/shared/session.service';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

const IMAGE_DIR = 'stored-images';
const API_URL = 'http://192.168.1.2:5000/property'
interface LocalFile{
  name: string;
  path:string;
  data:string;
}
@Component({
  selector: 'app-addlisting',
  templateUrl: './addlisting.page.html',
  styleUrls: ['./addlisting.page.scss'],
})
export class AddlistingPage implements OnInit {
  propertyForm: FormGroup;
  images: LocalFile[] = [];
  
  public sessionID;
  public userID;

  constructor(
    private formBuilder: FormBuilder, 
    private platform:Platform, 
    private loadingCtrl:LoadingController, 
    private http:HttpClient,
    private file: File, 
    private transfer: FileTransfer,
    private session:SessionService,
    private alertController:AlertController,
    private router:Router,
    private navCtrl:NavController
    ) {
    this.propertyForm = this.formBuilder.group({
      propertyLandSize: ['', Validators.required],
      address: ['', Validators.required],
      propertyLandSizeUnit: ['sq.m', Validators.required],
      legalLandDescription: ['', Validators.required],
      price: ['', Validators.required],
      propertyType: ['farmland', Validators.required],
      moreDetails: [''],
      documents: [[]],
    });
   }


  async ngOnInit() {
    
    await this.session.init();

    this.getSessionData();
    this.loadFiles();

  }

  async getSessionData(){
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : '+sessionID_data);
    console.log('USER ID : '+userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;
 }


  onFileSelected(event) {
    const files = Array.from(event.target.files);
    this.propertyForm.get('documents').setValue(files);


   
  }

   fileInfoArrayToStringArray(fileInfoArray: LocalFile[]): string[] {
    return fileInfoArray.map((fileInfo) => fileInfo.path);
  }

  async loadFiles() {
    this.images = [];
  
    const loading = await this.loadingCtrl.create({
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
        name:fileInfo.name,
        path:filePath,
        data: `data:image/jpeg;base64,${readFile.data}`
      });
      console.log("READ: ", readFile);
  

    }
  }
  async startUpload(file:LocalFile){
    const response = await fetch(file.data);
    console.log(response);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, file.name)
    this.uploadData(formData);

  }
  async uploadData(formData:FormData){
    const loading = await this.loadingCtrl.create({
      message:'Uploading',
    });
    await loading.present();

    

    this.http.post(API_URL,formData).pipe(
      finalize( () => {
        loading.dismiss(); 
      })
    ).subscribe(res => {
      console.log(res);
    })
  }

 async deleteImage(file:LocalFile){
  await Filesystem.deleteFile({
    directory:Directory.Data,
    path:file.path
  });
  this.loadFiles();

  }
  // async loadFiles(){
  //   this.images = [];
  //   const loading = await this.loadingCtrl.create({
  //     message:'Loading Images...',
  //   });
  //   await loading.present();

  //   Filesystem.readdir({
  //     directory:Directory.Data,
  //     path:IMAGE_DIR
  //   }).then(result => {
  //     console.log('HERE ',result);
  //     this.LoadFileData(result.files);
  //   }, async err=> {
  //     console.log('err: ', err);
  //     await Filesystem.mkdir({
  //       directory:Directory.Data,
  //       path:IMAGE_DIR
  //     });
  //   }).then(_=>{
  //     loading.dismiss();
  //   })
  // }

  // async LoadFileData(fileNames:String[]){
  //   for(let f of fileNames){
  //     const filePath = `${IMAGE_DIR}/${f}`;

  //     const readFile = await Filesystem.readFile({
  //       directory:Directory.Data,
  //       path: filePath
  //     });
  //     console.log('READ: ',readFile);
  //   }

  // }
  async onSubmit() {
    // console.log(this.propertyForm.value);
    const submitPropertyData = new FormData();
    // const files = this.propertyForm.get('documents').value;
    submitPropertyData.append('sessionID', this.sessionID);
    submitPropertyData.append('userID', this.userID);
    submitPropertyData.append('propertyLandSize', this.propertyForm.get('propertyLandSize').value);
    submitPropertyData.append('address', this.propertyForm.get('address').value);
    submitPropertyData.append('propertyLandSizeUnit', this.propertyForm.get('propertyLandSizeUnit').value);
    submitPropertyData.append('legalLandDescription', this.propertyForm.get('legalLandDescription').value);
    submitPropertyData.append('price', this.propertyForm.get('price').value);
    submitPropertyData.append('propertyType', this.propertyForm.get('propertyType').value);
    submitPropertyData.append('moreDetails', this.propertyForm.get('moreDetails').value);

    const document = this.propertyForm.get('documents').value;
    
    for (let i = 0; i < document.length; i++) {
   
      submitPropertyData.append('document', document[i]);

    }

    for( let i=0;i<this.images.length;i++)
    {
      
    const response = await fetch(this.images[i].data);
    this.deleteImage(this.images[i]);
    console.log(response);
    const blob = await response.blob();
    submitPropertyData.append('images', blob, this.images[i].name)
    
  }
 
    
    
  
    const loading = await this.loadingCtrl.create({
      message:'Uploading',
    });

    await loading.present();

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.post(API_URL,submitPropertyData,{ headers: headers }).pipe(
      finalize( () => {
        loading.dismiss(); 
         this.propertyForm.get('documents').setValue('');
      })
    ).subscribe(res => {
      this.successAlert();
      this.navCtrl.navigateRoot('/dashboard');
    })
    for( let i=0;i<this.images.length;i++)
    {
    this.deleteImage(this.images[i]);  
  }
 
  }
  async selectImage(){
    const image = await Camera.getPhoto({
      quality:90,
      allowEditing:false,
      resultType:CameraResultType.Uri,
      source: CameraSource.Photos
    });
    console.log(image);
    if(image){
      this.saveImage(image);
    }
  }

  async saveImage(photo:Photo){
    const base64Data = await this.readAsBase64(photo);
    console.log(base64Data);
    const fileName = new Date().getTime() +'.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory:Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data
    });
    console.log('saved: ',savedFile);
    this.loadFiles();
  }

  async readAsBase64(photo:Photo){
    if(this.platform.is('hybrid')){
      const file = await Filesystem.readFile({
        path:photo.path
      });
      return file.data;
    }
    else{
       const response = await fetch(photo.webPath);
       const blob = await response.blob();

       return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob:Blob) => new Promise ((resolve,reject) =>{
      const reader = new FileReader;
      reader.onerror = reject;
      reader.onload = () =>{
        resolve(reader.result);

      };
      reader.readAsDataURL(blob);
  });

  async successAlert() {
    const alert = await this.alertController.create({
      header: 'Add Property Listing',
      subHeader: 'Success!',
      message: 'Please wait while we review your property listing.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
