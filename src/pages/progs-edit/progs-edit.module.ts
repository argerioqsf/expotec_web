import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProgsEditPage } from './progs-edit';

@NgModule({
  declarations: [
    ProgsEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ProgsEditPage),
  ],
})
export class ProgsEditPageModule {}
