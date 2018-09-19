import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController, ActionSheetController, MenuController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { EmailValidator } from "../../validators/email";
/**
 * Generated class for the AddPalestrantePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'page-add-palestrante'
})
@Component({
  selector: 'page-add-palestrante',
  templateUrl: 'add-palestrante.html',
})
export class AddPalestrantePage {
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
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              formBuilder: FormBuilder,
              private firebaseProvider: FirebaseProvider,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private actionSheetCtrl: ActionSheetController,
              private camera: Camera,
              private menuCtrl: MenuController) {
                
  this.imageuid = this.generateUUID();
  this.signupForm = formBuilder.group({
    email: ["",
        Validators.compose([Validators.required, EmailValidator.isValid])
        ],
    desc: ["",
          Validators.compose([Validators.minLength(1), Validators.required])
        ],
    nome: ["",
        Validators.compose([Validators.minLength(1), Validators.required])
        ],
    telefone: ["",
        Validators.compose([Validators.minLength(1), Validators.required])
      ]	 
  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPalestrantePage');
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
		if( this.imageURL != "assets/images/newUser-b.png" && this.cont == false ){
			 console.log("deletar foto de perfil que não será usada");
			this.firebaseProvider.delImage(this.imageURL).then(()=>{
        console.log("foto deletada");
      });
      }
	}

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Adicionar foto',
      buttons: [
        { 
          icon:'md-image',
          text: 'Galeria',
          role: 'destructive',
          handler: () => {
           this.selectPhoto();
          }
        },{
          icon:'md-camera',
          text: 'Camera',
          handler: () => {
           this.takePhoto();
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
  
  takePhoto() {
    this.camera.getPicture({
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: true,
      targetWidth: 300,
      targetHeight: 300
    }).then(imageData => {
      this.myPhoto = imageData;
      this.fotooff = imageData;
      this.loading2 = this.loadingCtrl.create();
      this.loading2.present();
      this.uploadPhoto();
    }, error => {
      //alert("ERROR -> " + JSON.stringify(error));
    });
  }

  selectPhoto(): void {

    this.camera.getPicture({

      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 50,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 300,
			targetHeight: 300
			
    }).then(imageData => {

			this.myPhoto = imageData;
			this.fotooff = imageData;
      this.loading2 = this.loadingCtrl.create();
      this.loading2.present();
      this.uploadPhoto();
			
    }, error => {

		 //alert("ERROR -> " + JSON.stringify(error));
		 
    });
  }

  public uploadPhoto(): void { 
		this.firebaseProvider.uploadFotoPerfil(this.imageuid,this.myPhoto).then((resp:any)=>{
      if(resp.status == "OK"){
        console.log('File available at', resp.body);
        this.imageURL = resp.body;
        this.loading2.dismiss();
      }else{
        this.loading2.dismiss();
        let alert = this.alertCtrl.create({
          title:"Erro no carregamento da imagem",
          subTitle:"Tente novamente"
        });
        alert.present();
      }
    });
	}

}
