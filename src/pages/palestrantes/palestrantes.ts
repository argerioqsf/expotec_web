import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ModalController, ViewController, Platform } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { BackgroundMode } from '@ionic-native/background-mode';

/**
 * Generated class for the PalestrantesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'palestrantes'
})
@Component({
  selector: 'page-palestrantes',
  templateUrl: 'palestrantes.html',
})
export class PalestrantesPage {
  palestrantes = null;
  palestrantesSnap = [];
  constructor(public navCtrl: NavController,
              private firebaseProvider: FirebaseProvider,
              private menuCtrl: MenuController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController,
              private platform: Platform,
              private backgroundMode: BackgroundMode) {
              this.palestrantesOn();
              this.platform.registerBackButtonAction(() => {
                if(!this.viewCtrl.enableBack()) { 
                  this.backgroundMode.moveToBackground();
                }else{
                    this.navCtrl.pop();
                } 
              });
  }

  sideMenu(){
    this.menuCtrl.open();
  }

  palestrantesOn(){
      this.firebaseProvider.refOn("palestrantes/").orderByChild('nome').on("value",(progSnap:any)=>{
        console.log("progs0: ",progSnap.val());
        this.palestrantesSnap = progSnap;
        this.ProgOrder();
      });
  }

  info(palestrante){
    console.log("palestrante: ",palestrante);
    let modal = this.modalCtrl.create("page-palestrantes-info",{id:palestrante.id});
    modal.onDidDismiss(data => {
      this.platform.registerBackButtonAction(() => {
        if(!this.viewCtrl.enableBack()) { 
          this.backgroundMode.moveToBackground();
        }else{
            this.navCtrl.pop();
        } 
      });
    });
    modal.present();
  }

  ProgOrder(){
        console.log("palestrantesSnap: ",this.palestrantesSnap);
        this.firebaseProvider.TransformList(this.palestrantesSnap).then((palestrantes:any)=>{
          this.palestrantes = palestrantes;
        });
  }
}
