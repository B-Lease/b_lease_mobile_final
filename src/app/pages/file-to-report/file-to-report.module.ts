import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FileToReportPageRoutingModule } from './file-to-report-routing.module';

import { FileToReportPage } from './file-to-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FileToReportPageRoutingModule
  ],
  declarations: [FileToReportPage]
})
export class FileToReportPageModule {}
