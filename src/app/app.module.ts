import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { FormsModule } from '@angular/forms';

import { NgxDropzoneModule } from 'ngx-dropzone';

import { Network } from '@ionic-native/network/ngx';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';

import { Drivers } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx'
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';


import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { environment } from 'src/environments/environment.prod';
const config: SocketIoConfig = { url: environment.SOCKET_API_URL, options: {}};

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule, 
    NgxDropzoneModule,
    FormsModule,
    ReactiveFormsModule,  
    NgxExtendedPdfViewerModule,
    SocketIoModule.forRoot({ url: `${environment.SOCKET_API_URL}/` }),
    
    IonicStorageModule.forRoot({
      name:"sessionstorage",
      driverOrder:[CordovaSQLiteDriver._driver,Drivers.IndexedDB, Drivers.LocalStorage]
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network,NetworkInterface, File,
    FileOpener,
    DocumentViewer
  ],


  bootstrap: [AppComponent],
})
export class AppModule {}



