import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PalestrantesEditPage } from './palestrantes-edit';

@NgModule({
  declarations: [
    PalestrantesEditPage,
  ],
  imports: [
    IonicPageModule.forChild(PalestrantesEditPage),
  ],
})
export class PalestrantesEditPageModule {}
