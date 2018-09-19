import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ModalController, ViewController, Platform } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { BackgroundMode } from '@ionic-native/background-mode';

/**
 * Generated class for the ProgsMaratonasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'page-progs-maratonas'
})
@Component({
  selector: 'page-progs-maratonas',
  templateUrl: 'progs-maratonas.html',
})
export class ProgsMaratonasPage {

  progs = null;
  filtro = "Todos";
  progSnap = [];
  constructor(public navCtrl: NavController,
              private firebaseProvider: FirebaseProvider,
              private menuCtrl: MenuController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController,
              private platform: Platform,
              private backgroundMode: BackgroundMode) {
              this.progOn();
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

  Filtro() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Filtro');

    alert.addInput({
      type: 'radio',
      label: 'Todos',
      value: 'Todos',
      checked: (this.filtro == "Todos")
    });

    alert.addInput({
      type: 'radio',
      label: 'Maloca',
      value: 'maloca',
      checked: (this.filtro == "maloca")
    });

    alert.addInput({
      type: 'radio',
      label: 'Auditório',
      value: 'auditório',
      checked: (this.filtro == "auditório")
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.filtro = data;
        this.ProgOrder();
      }
    });
    alert.present();
  }

  progOn(){
      this.firebaseProvider.refOn("prog/").orderByChild('tipo').equalTo('maratona').on("value",(progSnap:any)=>{
        console.log("progs0: ",progSnap.val());
        this.progSnap = progSnap;
        this.ProgOrder();
      });
  }

  info(prog){
    let modal = this.modalCtrl.create("page-info",{prog:prog});
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
        console.log("progSnap: ",this.progSnap);
        this.firebaseProvider.TransformList(this.progSnap).then((progs:any)=>{
          let progs2 = [];
          for (let i = 0; i < progs.length; i++) {
              let horaI = progs[i].horario.split("-");
              if (progs2.length != 0) {
                for (let j = 0; j < progs2.length; j++) {
                  console.log("progs[j].horaI , horaI[0]: ",progs2[j].horaI ," / ", horaI[0]);
                  if(progs2[j].horaI == horaI[0]){
                    if(progs[i].local == "auditório"){
                      progs[i].cor = "red";
                    }
                    if(progs[i].local == "maloca"){
                      progs[i].cor = "blue";
                    }
                    if (progs[i].local == this.filtro || this.filtro == "Todos") {
                      progs2[j].progs.push(progs[i]);
                      console.log("progs3: ",progs2);
                    }
                    break;
                  }
                  if(j == progs2.length - 1){
                    let progsT:any = [];
                    if(progs[i].local == "auditório"){
                      progs[i].cor = "red";
                    }
                    if(progs[i].local == "maloca"){
                      progs[i].cor = "blue";
                    }
                    if (progs[i].local == this.filtro || this.filtro == "Todos") {
                      progsT.push(progs[i]);
                        progs2.push({horaI:horaI[0],progs:progsT,agora:false});
                        console.log("progs1: ",progs2);
                    }
                    break;
                  }
                }
              }else{
                let progsT:any = [];
                if(progs[i].local == "auditório"){
                  progs[i].cor = "red";
                }
                if(progs[i].local == "maloca"){
                  progs[i].cor = "blue";
                }
                if (progs[i].local == this.filtro || this.filtro == "Todos") {
                  progsT.push(progs[i]);
                    progs2.push({horaI:horaI[0],progs:progsT,agora:false});
                    console.log("progs2: ",progs2);
                }
              }
            if(i == progs.length - 1){
              this.progs = progs2;
              console.log("progs: ",this.progs);
            }
          }
        });
  }
}
