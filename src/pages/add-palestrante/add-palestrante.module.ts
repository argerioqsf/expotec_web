import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPalestrantePage } from './add-palestrante';

@NgModule({
  declarations: [
    AddPalestrantePage,
  ],
  imports: [
    IonicPageModule.forChild(AddPalestrantePage),
  ],
})
export class AddPalestrantePageModule {}
