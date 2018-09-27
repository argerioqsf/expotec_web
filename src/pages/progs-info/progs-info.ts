import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, ModalController, ActionSheetController, AlertController, LoadingController } from 'ionic-angular';
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
  id = null;
  edit = false;
  locais;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private platform: Platform,
              private viewCtrl: ViewController,
              private backgroundMode: BackgroundMode,
              private firebaseProvider: FirebaseProvider,
              private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {
    this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
    });
    firebaseProvider.getLocais().then(locais=>{
      this.locais =  locais;
      console.log("locais: ", this.locais);
      console.log("prog: ", this.navParams.get("id"));
      this.getId();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProgsInfoPage');
  }
  
  getId(){
    this.id = this.navParams.get("id");
    this.progOn();
  }

  ionViewDidLeave(){
    if(this.edit == false){
      console.log('refOff prog/+this.id');
      this.firebaseProvider.refOff("prog/"+this.id);
    }
  }

  Trim(vlr) {
    while(vlr.indexOf(" ") != -1){
      vlr = vlr.replace(" ", "");
    }
    return vlr;
  }

  progOn(){
    if(this.id != null){
      this.firebaseProvider.refOn("prog/"+this.id).on("value",(prog:any)=>{
        console.log("progOn/info: ",prog.val());
        for (let k = 0; k < this.locais.length; k++) {
          if(prog.val().local == this.Trim(this.locais[k].local)){
            this.prog = prog.val();
            this.prog.cor = this.locais[k].cor;
            console.log(this.locais[k].local + " prog: ",this.prog);
            break;
          }
        }
        this.palestrantesOn();
      });
    }else{
      this.getId();
    }
  }

  palestrantesOn(){
    console.log("prog.palestrantes/info: ",this.prog.palestrantes);
    if(this.prog.palestrantes && this.prog.palestrantes.length > 0){
      this.palestrantes = [];
      for (let i = 0; i < this.prog.palestrantes.length; i++) {
          this.firebaseProvider.refOn("palestrantes/"+this.prog.palestrantes[i]).once("value",(palestrante:any)=>{
            if(palestrante.val()){
              this.palestrantes.push(palestrante.val());
            }
          });
          if (i == this.prog.palestrantes.length - 1) {
            if (!(this.palestrantes.length > 0)) {
              this.palestrantes = [];
            }
          }
      }
    }
  }

  infoPalestrantes(palestrante){
    console.log("palestrante: ",palestrante);
    let modal = this.modalCtrl.create("page-palestrantes-info",{id:palestrante.id});
    modal.onDidDismiss(data => {
      this.platform.registerBackButtonAction(() => {
        this.viewCtrl.dismiss();
      });
    });
    modal.present();
  }
  
  progEdit(){
    console.log("progEdit: ",this.prog);
    this.edit = true;
    let modal = this.modalCtrl.create("progs-edit",{id:this.prog.id});
    modal.onDidDismiss(data => {
      this.edit = false;
      this.platform.registerBackButtonAction(() => {
        this.viewCtrl.dismiss();
      });
    });
    modal.present();
  }

  voltar(){
    this.viewCtrl.dismiss();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Deseja realmente deletar esta programação?',
      buttons: [
        { 
          text: 'Sim',
          handler: () => {
            this.deleteProg();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
	}

  deleteProg(){
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      duration: 30000
    });
    loading.present();
    let ok = false;
    if(this.prog.imagem){
      console.log("this.prog.imagem: ",this.prog.imagem);
      this.firebaseProvider.delImage(this.prog.imagem).then(()=>{
        console.log("foto deletada");
        this.deleteProg2().then(result=>{
          if (result == "OK") {
            this.voltar();
            ok = true;
            loading.dismiss();
          }
        });
      });
    }else{
      this.deleteProg2().then(result=>{
        if (result == "OK") {
          this.voltar();
          ok = true;
          loading.dismiss();
        }
      });
    }
    loading.onDidDismiss(() => {
      console.log('Ok : ',ok);
      if(ok == false){
        let alert = this.alertCtrl.create({
          title:"Houve um erro na comunicação com o servidor",
          subTitle:"verifique sua internet",
        });
        alert.present();
      }
      if(ok == true){
        let alert = this.alertCtrl.create({
          title:"Programação exluuida com sucesso!"
        });
        alert.present();
        }
      });
  }

  deleteProg2(){
    return new Promise((resolve,reject)=>{
      console.log("this.prog.id: ",this.prog.id);
      this.firebaseProvider.refOff("prog/"+this.prog.id);
      this.firebaseProvider.delete("prog/"+this.prog.id).then(()=>{
        console.log("Programação deletada");
        resolve("OK");
      });
    });
  }

}
