import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, ActionSheetController, ModalController, AlertController, LoadingController } from 'ionic-angular';
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
  id = null;
  edit = false;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private platform: Platform,
              private viewCtrl: ViewController,
              private backgroundMode: BackgroundMode,
              private firebaseProvider: FirebaseProvider,
              private actionSheetCtrl: ActionSheetController,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {
    this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
    });
    console.log("palestrante: ", this.palestrante);
    this.getId();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProgsInfoPage');
  }

  getId(){
    this.id = this.navParams.get("id");
    this.progOn();
  }

  progOn(){
    if(this.id != null){
      this.firebaseProvider.refOn("palestrantes/"+this.id).on("value",(prog:any)=>{
        console.log("palestranteOn: ",prog.val());
        this.palestrante = prog.val();
        console.log("palestrante: ",this.palestrante);
      });
    }else{
      this.getId();
    }
  }

  voltar(){
    this.viewCtrl.dismiss();
  }

  ionViewDidLeave(){
    if(this.edit == false){
      console.log('refOff palestrantes/+this.id');
    this.firebaseProvider.refOff("palestrantes/"+this.palestrante.id);
    }
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Deseja realmente deletar este palestrante?',
      buttons: [
        { 
          text: 'Sim',
          role: 'destructive',
          handler: () => {
            this.deletePalestrante();
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
  
  palestranteEdit(){
    console.log("palestranteEdit: ",this.palestrante);
    this.edit = true;
    let modal = this.modalCtrl.create("palestrantes-edit",{id:this.palestrante.id});
    modal.onDidDismiss(data => {
      this.edit = false;
      this.platform.registerBackButtonAction(() => {
        this.viewCtrl.dismiss();
      });
    });
    modal.present();
  }

  deletePalestrante(){
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      duration: 30000
    });
    loading.present();
    let ok = false;
    if(this.palestrante.imagem != "assets/images/newUser-b.png"){
      this.firebaseProvider.delImage(this.palestrante.imagem).then(()=>{
        console.log("foto deletada");
        this.deletePalestrante2().then(result=>{
          if (result == "OK") {
            this.voltar();
            ok = true;
            loading.dismiss();
          }
        });
      });
    }else{
      this.deletePalestrante2().then(result=>{
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
          title:"Programação excluida com sucesso!"
        });
        alert.present();
        }
      });
  }

  deletePalestrante2(){
    return new Promise((resolve,reject)=>{
      this.firebaseProvider.refOff("palestrantes/"+this.palestrante.id);
      this.firebaseProvider.delete("palestrantes/"+this.palestrante.id).then(()=>{
        console.log("Palestrante deletado");
        resolve("OK");
      });
   });
  }

}
