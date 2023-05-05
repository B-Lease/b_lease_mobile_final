import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem';
import { LoadingController, Platform, AlertController, NavController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { File } from '@ionic-native/file/ngx';

import { SessionService } from 'src/app/shared/session.service';
import { Router, ActivatedRoute } from '@angular/router';

import * as L from 'leaflet';
import { environment } from 'src/environments/environment.prod';
import { Geolocation } from '@capacitor/geolocation';
import { LoadingService } from 'src/app/shared/loading.service';


const IMAGE_DIR = 'stored-images';
// const API_URL = 'http://192.168.1.2:5000/property'

interface LocalFile {
  name: string;
  path: string;
  data: string;
}
@Component({
  selector: 'app-addlisting',
  templateUrl: './addlisting.page.html',
  styleUrls: ['./addlisting.page.scss'],
})
export class AddlistingPage implements OnInit {
  API_URL    = environment.API_URL+'property';
  private addpropertyMap: L.Map;
  private marker: L.Marker;
  private self_latitude: number;
  private self_longitude: number;

  propertyForm: FormGroup;
  images: LocalFile[] = [];

  public sessionID;
  public userID;

  private propertyLandSize: string;
  private propertyLandSizeUnit: string;
  private legalLandDescription: string;
  private price: string;
  private propertyType: string;
  private moreDetails: string;
  private lat: number;
  private lng: number;

  constructor(
    private formBuilder: FormBuilder,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private file: File,
    private session: SessionService,
    private alertController: AlertController,
    private router: Router,
    private navCtrl: NavController,
    private geolocation: Geolocation,
    private loading: LoadingService,
    private activatedroute: ActivatedRoute,
    private toastController:ToastController
  ) {

    this.lat = Number(this.activatedroute.snapshot.paramMap.get('lat'));
    this.lng = Number(this.activatedroute.snapshot.paramMap.get('lng'));


    this.propertyLandSize = this.activatedroute.snapshot.paramMap.get('propertyLandSize');
    this.propertyLandSizeUnit = this.activatedroute.snapshot.paramMap.get('propertyLandSizeUnit');
    this.legalLandDescription = this.activatedroute.snapshot.paramMap.get('legalLandDescription');
    this.price = this.activatedroute.snapshot.paramMap.get('price');
    this.propertyType = this.activatedroute.snapshot.paramMap.get('propertyType');
    this.moreDetails = this.activatedroute.snapshot.paramMap.get('moreDetails');

    this.propertyLandSize = this.propertyLandSize === null ? '' : this.propertyLandSize;
    this.propertyLandSizeUnit = this.propertyLandSizeUnit === null ? 'sq.m' : this.propertyLandSizeUnit;
    this.legalLandDescription = this.legalLandDescription === null ? '' : this.legalLandDescription;
    this.price = this.price === null ? '' : this.price;
    this.propertyType = this.propertyType === null ? 'farmland' : this.propertyType;
    this.moreDetails = this.moreDetails === null ? '' : this.moreDetails;

    this.propertyForm = this.formBuilder.group({
      propertyLandSize: [this.propertyLandSize, Validators.required],
      address: ['', Validators.required],
      propertyLandSizeUnit: [this.propertyLandSizeUnit, Validators.required],
      legalLandDescription: [this.legalLandDescription, Validators.required],
      price: [this.price, Validators.required],
      propertyType: [this.propertyType, Validators.required],
      moreDetails: [this.moreDetails],
      documents: [[]],
    });
  }


  async ngOnInit() {

    await this.session.init();

    this.getSessionData();
    this.loadFiles();
    this.getAddressValue();

    await this.loading.present('Loading Maps');
    await this.getCurrentLocation();
    await this.loading.dismiss();

    if (this.lat === 0 && this.lng === 0) {


      this.addpropertyMap = await L.map('mapId').setView([this.self_latitude, this.self_longitude], 18);
    }
    else {
      this.addpropertyMap = await L.map('mapId').setView([this.lat, this.lng], 18);
    }

    this.addpropertyMap.zoomControl.remove();
    if (L.Browser.retina) {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 20,
        tileSize: 512,
        zoomOffset: -1,
        detectRetina: true
      }).addTo(this.addpropertyMap);
    } else {
      L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(this.addpropertyMap);
    }

    const customIcon = L.icon({
      iconUrl: 'assets/icon/b_lease_marker.svg',
      // shadowUrl: 'assets/icon/b_lease_marker-shadow.png',
      iconSize: [25, 41],
      // shadowSize: [35, 41],
      iconAnchor: [12, 41],
      // shadowAnchor: [12, 41],
      popupAnchor: [0, -35],
    });

    if (this.lat != 0 && this.lng != 0) {
      this.marker = L.marker([this.lat, this.lng], { icon: customIcon }).addTo(this.addpropertyMap);
    }
  
    

  }

  async ionViewDidEnter() {
 



  }

  async getSessionData() {
    let sessionID_data = await this.session.getSessionID();
    let userID_data = await this.session.getUserID();
    console.log('SESSION ID : ' + sessionID_data);
    console.log('USER ID : ' + userID_data);
    this.sessionID = sessionID_data;
    this.userID = userID_data;
  }

  async getCurrentLocation() {
    const coordinates: GeolocationPosition = await Geolocation.getCurrentPosition();
    this.self_latitude = coordinates.coords.latitude;
    this.self_longitude = coordinates.coords.longitude;
    console.log('Latitude: ' + this.self_latitude + ', Longitude: ' + this.self_longitude);
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
        name: fileInfo.name,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`
      });
      console.log("READ: ", readFile);


    }
  }
  async startUpload(file: LocalFile) {
    const response = await fetch(file.data);
    console.log(response);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, file.name)
    this.uploadData(formData);

  }
  async uploadData(formData: FormData) {
    const loading = await this.loadingCtrl.create({
      message: 'Uploading',
    });
    await loading.present();



    this.http.post(this.API_URL, formData).pipe(
      finalize(() => {
        loading.dismiss();
      })
    ).subscribe(res => {
      console.log(res);
    })
  }

  async deleteImage(file: LocalFile) {
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: file.path
    });
    this.loadFiles();

  }

  async onSubmit() {
    // console.log(this.propertyForm.value);
    const submitPropertyData = new FormData();
    // const files = this.propertyForm.get('documents').value;
    const document = this.propertyForm.get('documents').value;
    var propertyLandSize = this.propertyForm.get('propertyLandSize').value;
    var address = this.propertyForm.get('address').value;
    var propertyLandSizeUnit = this.propertyForm.get('propertyLandSizeUnit').value;
    var legalLandDescription = this.propertyForm.get('legalLandDescription').value;
    var price = this.propertyForm.get('price').value;
    var propertyType =  this.propertyForm.get('propertyType').value;
    var moreDetails = this.propertyForm.get('moreDetails').value;

    if (this.images.length>0 
        && document.length>0 &&
        propertyLandSize != null &&
        address != null &&
        propertyLandSizeUnit != null &&
        legalLandDescription != null &&
        price != null &&
        propertyType != null &&
        moreDetails != null 
      ){
        submitPropertyData.append('sessionID', this.sessionID);
        submitPropertyData.append('userID', this.userID);
        submitPropertyData.append('propertyLandSize', this.propertyForm.get('propertyLandSize').value);
        submitPropertyData.append('address', this.propertyForm.get('address').value);
        submitPropertyData.append('latitude', this.lat.toString());
        submitPropertyData.append('longitude', this.lng.toString());
    
        submitPropertyData.append('propertyLandSizeUnit', this.propertyForm.get('propertyLandSizeUnit').value);
        submitPropertyData.append('legalLandDescription', this.propertyForm.get('legalLandDescription').value);
        submitPropertyData.append('price', this.propertyForm.get('price').value);
        submitPropertyData.append('propertyType', this.propertyForm.get('propertyType').value);
        submitPropertyData.append('moreDetails', this.propertyForm.get('moreDetails').value);
    

        for (let i = 0; i < document.length; i++) {
    
          submitPropertyData.append('document', document[i]);
    
        }
    
        for (let i = 0; i < this.images.length; i++) {
    
          const response = await fetch(this.images[i].data);
    
          console.log(response);
          const blob = await response.blob();
          submitPropertyData.append('images', blob, this.images[i].name)
    
        }
  
    
    
    
    
        const loading = await this.loadingCtrl.create({
          message: 'Uploading',
        });
    
        await loading.present();
    
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        this.http.post(this.API_URL, submitPropertyData, { headers: headers }).pipe(
          finalize(() => {
            loading.dismiss();
            this.propertyForm.get('documents').setValue('');
          })
        ).subscribe(res => {
          for (let i = 0; i < this.images.length; i++) {
            this.deleteImage(this.images[i]);
          }
          this.successAlert();
     
          this.navCtrl.navigateBack(['/dashboard']);
        });
        for (let i = 0; i < this.images.length; i++) {
          this.deleteImage(this.images[i]);
        }
    
      }
    else{
        if(
          this.images.length>0 
        && document.length>0 &&
        propertyLandSize == null ||
        address == null ||
        propertyLandSizeUnit == null ||
        legalLandDescription == null ||
        price == null ||
        propertyType == null ||
        moreDetails == null 
        ){
          this.incompleteToast();
        }

        if(this.images.length==0 
          && document.length>0 &&
          propertyLandSize != null &&
          address != null &&
          propertyLandSizeUnit != null &&
          legalLandDescription != null &&
          price != null &&
          propertyType != null &&
          moreDetails != null )
          {
            this.noImageToast();
        }

        if(this.images.length>0 
          && document.length==0 &&
          propertyLandSize != null &&
          address != null &&
          propertyLandSizeUnit != null &&
          legalLandDescription != null &&
          price != null &&
          propertyType != null &&
          moreDetails != null )
          {
            this.noDocumentToast();
        }
    }

  }
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

  async successAlert() {
    const alert = await this.alertController.create({
      header: 'Add Property Listing',
      subHeader: 'Success!',
      message: 'Please wait while we review your property listing.',
      buttons: ['OK'],
    });

    await alert.present();
  }


  getAddress() {

    this.propertyLandSize = this.propertyForm.get('propertyLandSize').value;
    this.propertyLandSizeUnit = this.propertyForm.get('propertyLandSizeUnit').value;
    this.legalLandDescription = this.propertyForm.get('legalLandDescription').value;
    this.price = this.propertyForm.get('price').value;
    this.propertyType = this.propertyForm.get('propertyType').value;
    this.moreDetails = this.propertyForm.get('moreDetails').value;

    this.navCtrl.navigateForward(['/getpropertyaddress', {
      propertyLandSize: this.propertyLandSize,
      propertyLandSizeUnit: this.propertyLandSizeUnit,
      legalLandDescription: this.legalLandDescription,
      price: this.price,
      propertyType: this.propertyType,
      moreDetails: this.moreDetails
    }]);



  }


  getAddressValue() {

    if (this.lat != null && this.lng != null) {
      const accessToken = environment.mapbox.accessToken;
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.lng},${this.lat}.json?access_token=${accessToken}`;
      this.http.get(url).subscribe((res: any) => {
        if (res.features && res.features.length > 0) {

          console.log(res.features[0].place_name);
          this.propertyForm.patchValue({
            address: res.features[0].place_name
          });
        } else {
          console.log('No address found.');
        }
      });
    }

  }

  async incompleteToast() {
    const toast = await this.toastController.create({
      message: 'Please fill in the fields completely.',
      duration: 3000,
      position: 'bottom'
    });

    await toast.present();
  }
  async noImageToast() {
    const toast = await this.toastController.create({
      message: 'Please upload an image',
      duration: 3000,
      position: 'bottom'
    });

    await toast.present();
  }
  async noDocumentToast() {
    const toast = await this.toastController.create({
      message: 'Please upload your documents',
      duration: 3000,
      position: 'bottom'
    });

    await toast.present();
  }


  async ngOnDestroy() {
    if (this.addpropertyMap) {
      await this.addpropertyMap.remove();
    }
  }
}
