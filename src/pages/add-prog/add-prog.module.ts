import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddProgPage } from './add-prog';

@NgModule({
  declarations: [
    AddProgPage,
  ],
  imports: [
    IonicPageModule.forChild(AddProgPage),
  ],
})
export class AddProgPageModule {}
