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
  lessorID: any
  lessor_fname: any;
  lessor_mname:any;
  lessor_lname:any;
  lesseeID: any
  lessee_fname: any;
  lessee_mname:any;
  lessee_lname:any;
  userID: any
  leasing_start:any;
  leasing_end:any;
  land_description:any;

  button1 = ''
  button2 = ''
  button3 = ''

  display1 = true
  display2 = true
  display3 = true

  images: LocalFile[] = [];
  signbase64 = '';
  response: any[];
  @ViewChild('signature') signature: IonInput;

  propertyImage:any;
  data: any

  complaineeID:any
  notpastdate = false;
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
  
   }

   async ngOnInit() {
    // this.getPDF();


    this.userID = this.activatedroute.snapshot.paramMap.get('userID');

    this.propertyID = this.activatedroute.snapshot.paramMap.get('propertyID');
    this.address = this.activatedroute.snapshot.paramMap.get('address');
    this.propertyImage = this.activatedroute.snapshot.paramMap.get('propertyImage');
    this.land_description = this.activatedroute.snapshot.paramMap.get('land_description');

    this.leasingID = this.activatedroute.snapshot.paramMap.get('leasingID');
    this.leasing_status = this.activatedroute.snapshot.paramMap.get('leasing_status');
    this.leasing_start = this.activatedroute.snapshot.paramMap.get('leasing_start');
    this.leasing_end = this.activatedroute.snapshot.paramMap.get('leasing_end');
   
    this.lessorID = this.activatedroute.snapshot.paramMap.get('lessorID');
    this.lessor_fname = this.activatedroute.snapshot.paramMap.get('lessor_fname');
    this.lessor_mname = this.activatedroute.snapshot.paramMap.get('lessor_mname');
    this.lessor_lname = this.activatedroute.snapshot.paramMap.get('lessor_lname');
    
    this.lesseeID = this.activatedroute.snapshot.paramMap.get('lesseeID');
    this.lessee_fname = this.activatedroute.snapshot.paramMap.get('lessee_fname');
    this.lessee_mname = this.activatedroute.snapshot.paramMap.get('lessee_mname');
    this.lessee_lname = this.activatedroute.snapshot.paramMap.get('lessee_lname');



    console.log(this.leasing_status)
    if (this.leasing_status == 'ongoing' || this.leasing_status == 'lessor_finished' || this.leasing_status == 'lessee_finished'){
      // this.display1 = false
      // this.display2 = false
      this.button1 = 'Rate'
      this.button2 = 'Finish'

      const response = this.http.get(this.API_URL+`complaints?leasingID=${this.leasingID}`).subscribe((data) => {
        if (typeof data === 'string') {
          this.data = JSON.parse(data);
          this.button3 = 'See Complaints'

        } else {
          this.data = Object.values(data);
          this.button3 = 'File Complaint'
        }
      });
      if (this.button2 == 'Finish') { this.checkDateDifference(this.leasing_end); }
    }
    else if (this.leasing_status === 'pending' && (this.userID == this.lesseeID)) {
      this.button1 = 'Sign'
      this.button2 = 'Reject'
      this.button3 = 'Approve'
    }
    else if (this.leasing_status === 'finished' && (this.userID == this.lessorID)) {
      this.display1 = false
      this.display2 = false
      this.button3 = 'Renew'
    }
    else{
      this.display1 = false
      this.display2 = false
      this.display3 = false       
    }

    
  }

  checkDateDifference(leasing_end:any){
    const mysqlDatetime = leasing_end;
    console.log(mysqlDatetime);
    const dateObj = new Date(mysqlDatetime);

    const currentDate = new Date();
    if (currentDate.getTime() >= dateObj.getTime()) {
      console.log('The current date and time is past or equal to the MySQL datetime.');
      this.notpastdate = false;
    } else {
      console.log('The current date and time is before the MySQL datetime.');
      this.notpastdate = true;
    }


  }

  async checkSignature(){
    if (this.button3 === 'File Complaint'){
      console.log('file a complaint')
      if (this.userID === this.lessorID){
        this.complaineeID = this.lesseeID
      } 
      else {
        this.complaineeID = this.lessorID
      }
      const data = {
        complaintID: this.leasingID,
        complainerID: this.userID,
        complaineeID: this.complaineeID
      }
      this.navCtrl.navigateForward('/add-complaint', { queryParams: { data } });
    }
    else if (this.button3 === 'See Complaints'){
      console.log('see a complaint')
      const data = {
        complaintID: this.leasingID
      }
      this.navCtrl.navigateForward('/complaint-thread', { queryParams: { data } });
    }
    else if(this.button3 === 'Renew'){
      console.log('renew contract')
      const data = {
        'leasingID' : this.leasingID,
        'lessorID': this.lessorID,
        'lessor_fname' : this.lessor_fname,
        'lessor_mname' : this.lessor_mname,
        'lessor_lname' : this.lessor_lname,
        'lesseeID' : this.lesseeID,
        'lessee_fname' : this.lessee_fname,
        'lessee_mname' : this.lessee_mname,
        'lessee_lname' : this.lessee_lname,
        'address' : this.address,
        'land_description' : this.land_description
      }
      this.navCtrl.navigateForward('set-contract', { queryParams: { data } });
    }
    else {
      const signature = this.signbase64;
      console.log('value '+signature)
      if (signature === '' || this.images.length<1){
        const alert = await this.alertController.create({
          header: 'Oops!',
          subHeader: 'One more requirement..',
          message: 'Please upload your signature first.',
          buttons: ['OK'],
        });

        await alert.present();
      } else {
        this.approveContract(signature);
      }
    }
  }

  clearImages(){
    for (let i = 0; i < this.images.length; i++) {
      this.deleteImage(this.images[i]);
    }
  }
  
  async approveContract(signature){
    const loading = await this.ldingCtrl.create({
      message: "Signing Contract...",
    });
    await loading.present();

    const alert = await this.alertController.create({
      header: 'Success!',
      subHeader: 'Contract signed successfully',
      message: 'Please wait 1-2 business days for the admin to approve your contract',
      buttons: ['OK'],
    });

    try {
      const formData = {
        leasingID: this.leasingID,
        signature: signature
      }
      const response: HttpResponse<any> = await this.http.put(`${environment.API_URL}leasingstatus?leasingID=${this.leasingID}&leasing_status=1`, formData, { observe: 'response' }).toPromise();
      if(response.status === 201){
        console.log(response.status)
        await loading.dismiss();
        await alert.present();
        
      } else {

      }
    } catch (error) {
      console.log(error);
      // Handle the error
    }

    this.clearImages()

  }

  async declineContract(){
    console.log(this.leasing_status)
    if(this.button2 == 'Finish'){
      console.log('You can finish it')
      //3 ang status -- meaning wait for the other user to finish before sha ma 4 jud
      if(this.leasing_status == 'ongoing'){
        const alert = await this.alertController.create({
          header: 'Contract marked as finished!',
          subHeader: 'You marked the contract as finished. Let us wait for the other side to mark it as well.',
          buttons: ['OK'],
        });

        if(this.userID == this.lesseeID){
          try {
            const formData = {
              leasingID: this.leasingID,
            }
            const response: HttpResponse<any> = await this.http.put(`${environment.API_URL}leasingstatus?leasingID=${this.leasingID}&leasing_status=3`, formData, { observe: 'response' }).toPromise();
            if(response.status === 201){
              console.log(response.status)
              await alert.present();
              
            } else {
    
            }
          } catch (error) {
            console.log(error);
            // Handle the error
          }
        } else if(this.userID == this.lessorID){
          try {
            const formData = {
              leasingID: this.leasingID,
            }
            const response: HttpResponse<any> = await this.http.put(`${environment.API_URL}leasingstatus?leasingID=${this.leasingID}&leasing_status=4`, formData, { observe: 'response' }).toPromise();
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

      }
      else if((this.leasing_status == 'lessor_finished' && (this.userID == this.lesseeID)) || (this.leasing_status == 'lessee_finished' && (this.userID == this.lessorID))){
        const alert = await this.alertController.create({
          header: 'Contract finished!',
          subHeader: 'The contract has been marked as finished by both parties.',
          buttons: ['OK'],
        });

        try {
          const formData = {
            leasingID: this.leasingID,
          }
          const response: HttpResponse<any> = await this.http.put(`${environment.API_URL}leasingstatus?leasingID=${this.leasingID}&leasing_status=5`, formData, { observe: 'response' }).toPromise();
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
    } else {
      const alert = await this.alertController.create({
        header: 'Rejected contract',
        subHeader: 'Your contract has been declined.',
        buttons: ['OK'],
      });

      try {
        const formData = {
          leasingID: this.leasingID,
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

  }

  async openWordContract(){
    const url = this.API_URL+`leasingdocs?leasingID=${this.leasingID}`

    const arrayBuffer = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    this.http.get(url, { responseType: 'arraybuffer', observe: 'response' }).subscribe((response: HttpResponse<ArrayBuffer>) => {
      const contentType = response.headers.get('content-type');

      if (this.platform.is('android')) {
        // Check the file type based on the content type
        if (contentType === 'application/pdf') {
          // It's a PDF file   
          const fileName = 'lease_contract.pdf';
          const filePath = this.file.dataDirectory + fileName;

          this.file.writeFile(this.file.dataDirectory, fileName, arrayBuffer, { replace: true });

          // Open the file with the file opener plugin
          this.fileOpener.open(filePath, 'application/pdf')
            .then(() => console.log('File opened successfully'))
            .catch(e => console.log('Error opening file', e));
          
        } else if (contentType === 'application/msword' || contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          // It's a Word document

          const fileName = 'lease_contract.docx';
          const filePath = this.file.dataDirectory + fileName;

          this.file.writeFile(this.file.dataDirectory, fileName, arrayBuffer, { replace: true });

          // Open the file with the file opener plugin
          this.fileOpener.open(filePath, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            .then(() => console.log('File opened successfully'))
            .catch(e => console.log('Error opening file', e));

        } else {
          // It's a different file type
          // Handle or ignore accordingly
        }
      }  else {
          console.log('this file cannot be viewed on a non-Android platform')
        }

      // You can access the file data using response.body
      const fileData = response.body;
      // Perform further actions with the file data
    }, (error: any) => {
      // Handle the error
    });

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
    } else {
      console.log('not okay')
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
    console.log(this.images.length)
    this.loadFiles();
    

  }


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
          leasingID:this.leasingID,
          propertyID:this.propertyID,
          address:this.address,
          propertyImage:this.propertyImage
        }
      ])
    }
  }

}
