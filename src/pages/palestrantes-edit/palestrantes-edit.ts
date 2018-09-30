import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController, ActionSheetController, MenuController, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { EmailValidator } from "../../validators/email";
/**
 * Generated class for the PalestrantesEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'palestrantes-edit'
})
@Component({
  selector: 'page-palestrantes-edit',
  templateUrl: 'palestrantes-edit.html',
})
export class PalestrantesEditPage {

  public imageURL:any = "assets/images/newUser-b.png";
  public signupForm: FormGroup;
  cont = false;
  public singup:any = [];
  public imageuid;
  public myPhotosRef: any;
  public fotooff: any ="";
  public myPhoto: any = null;
  public myPhotoURL: any;
  public loading: Loading;
  public loading2: Loading;
  cargos:any = [];
  setores:any = [];
  arquivo:any = null;
  palestrante:any = null;
  id;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              formBuilder: FormBuilder,
              private firebaseProvider: FirebaseProvider,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private actionSheetCtrl: ActionSheetController,
              private camera: Camera,
              private menuCtrl: MenuController,
              private viewCtrl: ViewController) {
  this.signupForm = formBuilder.group({
    email: ["",
        Validators.compose([Validators.required, EmailValidator.isValid])
        ],
    desc: ["",
          Validators.compose([Validators.minLength(1), Validators.required])
        ],
    formacao: ["",
          Validators.compose([Validators.minLength(1), Validators.required])
        ],
    nome: ["",
        Validators.compose([Validators.minLength(1), Validators.required])
        ],
    telefone: ["",
        Validators.compose([Validators.minLength(1), Validators.required])
      ]	 
  });
  this.getId();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPalestrantePage');
  }

  atualizaArquivo(event){
      this.arquivo = event.srcElement.files[0];
      console.log("event: ",event);
      console.log("event.srcElement: ",event.srcElement.webkitRelativePath);
      this.enviarArquivo();
      
  }

  getId(){
    this.id = this.navParams.get("id");
    this.palestranteOn();
  }

  palestranteOn(){
    if (this.id != null) {
      this.firebaseProvider.refOn("palestrantes/"+this.id).on("value",palestrante=>{
        console.log("palestrante: ",palestrante.val());
        this.palestrante = palestrante.val();
        this.imageURL = palestrante.val().imagem;
        this.imageuid = palestrante.val().imagemUid;
      });
    }else{
      this.getId();
    }
  }

  enviarArquivo(){
    if(this.arquivo != null){
      let loading = this.loadingCtrl.create({
        spinner: 'ios',
        duration: 30000
      });
      loading.present();
      let ok = false;
      let metadata = {
        contentType: this.arquivo.type
      };
      let name = this.imageuid;
      let upload = this.firebaseProvider.imagemUpload("palestrantes/").child(name+".jpg").put(this.arquivo,metadata);
      upload.on('state_changed',(savedPicture:any) => {
        let progress:any = (savedPicture.bytesTransferred / savedPicture.totalBytes) * 100;
        progress = parseInt(progress);
        console.log('Upload is ' + progress + '% done');
      }, error => {
        loading.dismiss();
        console.log("Erro imagemupload");
			},()=>{
        upload.snapshot.ref.getDownloadURL().then((downloadURL)=>{
          console.log('File available at', downloadURL);
          this.imageURL = downloadURL;
          ok = true;
          loading.dismiss();
        console.log("OK imagemupload");
        });
      });
      
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
            title:"Imagem adicionada com sucesso!"
          });
          alert.present();
          }
        });
    }
  }
  
  private generateUUID(): any {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  sideMenu(){
    this.menuCtrl.open();
  }
  
  ionViewDidLeave(){
    this.firebaseProvider.refOff("palestrantes/"+this.id);
  }
  
  addPalestrante(){
    if (this.signupForm.controls.nome.valid){
      let loading = this.loadingCtrl.create({
        spinner: 'ios',
        duration: 30000
      });
      loading.present();
      let ok = false;
      this.signupForm.value.imagem = this.imageURL;
      this.signupForm.value.imagemUid = this.imageuid;
    console.log("singupForm: ",this.signupForm.value);
    let id = this.palestrante.id;
    this.signupForm.value.id = id;
    console.log("signupForm.value: ",this.signupForm.value); 
      this.firebaseProvider.update("palestrantes/"+this.signupForm.value.id,this.signupForm.value).then(()=>{
        console.log("this.signupForm.value: ",this.signupForm.value);
        ok = true;
        this.cont = true;
        this.voltar();
        loading.dismiss();
      },error=>{
        loading.dismiss();
        let alert = this.alertCtrl.create({
          title:"Houve um erro na comunicação com o servidor",
          subTitle:"não foi possivel efetuar a alteração: "+ error,
        });
        alert.present();
      });
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
          title:"Palestrante atualizado com sucesso!"
        });
        alert.present();
        }
      });
    }else{
      let alert = this.alertCtrl.create({
        title:"Preencha os campos corretamente."
      });
      alert.present();
    }
  }

  voltar(){
    this.viewCtrl.dismiss();
  }
}
