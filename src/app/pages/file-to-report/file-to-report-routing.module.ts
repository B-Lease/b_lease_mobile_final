import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FileToReportPage } from './file-to-report.page';

const routes: Routes = [
  {
    path: '',
    component: FileToReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileToReportPageRoutingModule {}
