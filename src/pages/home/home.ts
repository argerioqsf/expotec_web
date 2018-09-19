import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, ViewController, Platform } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { MenuController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
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
              private backgroundMode: BackgroundMode,
              private splashScreen: SplashScreen) {
                this.splashScreen.hide();
              this.progOn().then(resolve=>{
                this.ProgOrder(true);
              });
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
        this.ProgOrder(false);
      }
    });
    alert.present();
  }

  progOn(){
    return new Promise((resolve,reject)=>{
      this.firebaseProvider.refOn("prog/").orderByChild('fila').on("value",(progSnap:any)=>{
        console.log("progs0: ",progSnap.val());
        this.progSnap = progSnap;
        this.ProgOrder(false);
        resolve("OK");
      });
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

  ProgOrder(loop){
        console.log("progSnap: ",this.progSnap);
        this.firebaseProvider.TransformList(this.progSnap).then((progs:any)=>{
          let progs2 = [];
          for (let i = 0; i < progs.length; i++) {
            let horaA = this.firebaseProvider.Hora();
            let diaA = this.firebaseProvider.Dia();
            let horaP = progs[i].horario.split("-");
            horaP = horaP[0].split(":");
            horaP = horaP[0] + horaP[1];
            horaP = parseInt(horaP);
            let horaPF = progs[i].horario.split("-");
            horaPF = horaPF[1].split(":");
            horaPF = horaPF[0] + horaPF[1];
            horaPF = parseInt(horaPF);
            console.log("horaPF:", horaPF);
            console.log("horaP:", horaP);
            console.log("horaA:", horaA);
            console.log("diaA:", diaA);
            console.log("diaP:", progs[i].dia);
            console.log("progsList:", progs);
            if(progs[i].dia == diaA && (horaP >= horaA || horaA <= horaPF)){
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
                      if(horaP == horaA || (horaP <= horaA && horaA <= horaPF)){
                        progs2.push({horaI:horaI[0],progs:progsT,agora:true});
                        console.log("progs1: ",progs2);
                      }else{
                        progs2.push({horaI:horaI[0],progs:progsT,agora:false});
                        console.log("progs1: ",progs2);
                      }
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
                  if(horaP == horaA || (horaP <= horaA && horaA <= horaPF)){
                    progs2.push({horaI:horaI[0],progs:progsT,agora:true});
                    console.log("progs2: ",progs2);
                  }else{
                    progs2.push({horaI:horaI[0],progs:progsT,agora:false});
                    console.log("progs2: ",progs2);
                  }
                }
              }
            }
            if(i == progs.length - 1){
              this.progs = progs2;
              console.log("progs: ",this.progs);
              if(loop){
                this.loop();
              }
            }
          }
        });
  }

  loop(){
    setTimeout(() => {
      this.ProgOrder(true);
    }, 10000);
  }
}
