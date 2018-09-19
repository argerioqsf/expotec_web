import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the PalestrantesInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'page-palestrantes-info'
})
@Component({
  selector: 'page-palestrantes-info',
  templateUrl: 'palestrantes-info.html',
})
export class PalestrantesInfoPage {

  palestrante:any = null;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private platform: Platform,
              private viewCtrl: ViewController,
              private backgroundMode: BackgroundMode,
              private firebaseProvider: FirebaseProvider) {
    this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
    });
    this.palestrante = this.navParams.get("palestrante");
    this.progOn();
    console.log("palestrante: ", this.palestrante);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProgsInfoPage');
  }

  progOn(){
    this.firebaseProvider.refOn("palestrantes/"+this.palestrante.id).on("value",(prog:any)=>{
      console.log("palestranteOn: ",prog.val());
      this.palestrante = prog.val();
      console.log("palestrante: ",this.palestrante);
    });
  }

  voltar(){
    this.viewCtrl.dismiss();
  }

}
