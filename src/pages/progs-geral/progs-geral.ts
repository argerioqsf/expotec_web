import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ModalController, ViewController, Platform } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { BackgroundMode } from '@ionic-native/background-mode';

/**
 * Generated class for the ProgsGeralPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'page-progs-geral'
})
@Component({
  selector: 'page-progs-geral',
  templateUrl: 'progs-geral.html',
})
export class ProgsGeralPage {

  progs = null;
  filtro = "Todos";
  progSnap = [];
  locais;
  constructor(public navCtrl: NavController,
              private firebaseProvider: FirebaseProvider,
              private menuCtrl: MenuController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private viewCtrl: ViewController,
              private platform: Platform,
              private backgroundMode: BackgroundMode) {
              this.progOn();
              this.locais = firebaseProvider.getLocais();
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

    for (let i = 0; i < this.locais.length; i++) {
      alert.addInput({
        type: 'radio',
        label: this.locais[i].local,
        value: this.Trim(this.locais[i].local),
        checked: (this.filtro == this.locais[i].local)
      });
    }

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

  Trim(vlr) {
    while(vlr.indexOf(" ") != -1){
      vlr = vlr.replace(" ", "");
    }
    return vlr;
  }

  progOn(){
      this.firebaseProvider.refOn("prog/").orderByChild('fila').on("value",(progSnap:any)=>{
        console.log("progs0: ",progSnap.val());
        if(progSnap.val()){
          this.progSnap = progSnap;
          this.ProgOrder();
        }else{
          this.progs = [];
        } 
      });
  }

  info(prog){
    let modal = this.modalCtrl.create("page-info",{id:prog.id});
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

                    for (let k = 0; k < this.locais.length; k++) {
                      if(progs[i].local == this.Trim(this.locais[k].local)){
                        progs[i].cor = this.locais[k].cor;
                        break;
                      }
                    }

                    if (progs[i].local == this.filtro || this.filtro == "Todos") {
                      progs2[j].progs.push(progs[i]);
                      console.log("progs3: ",progs2);
                    }
                    break;
                  }
                  if(j == progs2.length - 1){
                    let progsT:any = [];
                    
                    for (let k = 0; k < this.locais.length; k++) {
                      if(progs[i].local == this.Trim(this.locais[k].local)){
                        progs[i].cor = this.locais[k].cor;
                        break;
                      }
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
                
                for (let k = 0; k < this.locais.length; k++) {
                  if(progs[i].local == this.Trim(this.locais[k].local)){
                    progs[i].cor = this.locais[k].cor;
                    break;
                  }
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
