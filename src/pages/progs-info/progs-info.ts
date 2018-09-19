import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, ModalController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the ProgsInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'page-info'
})
@Component({
  selector: 'page-progs-info',
  templateUrl: 'progs-info.html',
})
export class ProgsInfoPage {
  prog:any = null;
  palestrantes:any = null;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private platform: Platform,
              private viewCtrl: ViewController,
              private backgroundMode: BackgroundMode,
              private firebaseProvider: FirebaseProvider,
              private modalCtrl: ModalController) {
    this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
    });
    this.prog = this.navParams.get("prog");
    console.log("prog: ", this.navParams.get("prog"));
    this.progOn();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProgsInfoPage');
  }

  progOn(){
      this.firebaseProvider.refOn("prog/"+this.navParams.get("prog").id).on("value",(prog:any)=>{
        console.log("progOn: ",prog.val());
        if(prog.val().local == "auditório"){
          this.prog = prog.val();
          this.prog.cor = "red";
          console.log("audi prog: ",this.prog);
        }
        if(prog.val().local == "maloca"){
          this.prog = prog.val();
          this.prog.cor = "blue";
          console.log("malo prog: ",this.prog);
        }
        this.palestrantesOn();
      });
  }

  palestrantesOn(){
    if(this.prog.palestrantes.length > 0){
      this.palestrantes = [];
      for (let i = 0; i < this.prog.palestrantes.length; i++) {
          this.firebaseProvider.refOn("palestrantes/"+this.prog.palestrantes[i]).once("value",(palestrante:any)=>{
            this.palestrantes.push(palestrante.val());
          });
      }
    }
  }

  infoPalestrantes(palestrante){
    console.log("palestrante: ",palestrante);
    let modal = this.modalCtrl.create("page-palestrantes-info",{palestrante:palestrante});
    modal.onDidDismiss(data => {
      this.platform.registerBackButtonAction(() => {
        this.viewCtrl.dismiss();
      });
    });
    modal.present();
  }

  voltar(){
    this.viewCtrl.dismiss();
  }

}
