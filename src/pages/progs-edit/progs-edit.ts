import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController, ActionSheetController, MenuController, ToastController, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { EmailValidator } from "../../validators/email";
/**
 * Generated class for the ProgsEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'progs-edit'
})
@Component({
  selector: 'page-progs-edit',
  templateUrl: 'progs-edit.html',
})
export class ProgsEditPage {

  public imageURL:any = "assets/images/circulo.png";
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
  prog = null;
  tipo;
  cargos:any = [];
  setores:any = [];
  arquivo:any = null;
  palestrantes = [];
  palestrantes2 = [];
  palestrantesPerfil:any = [];
  addPalest = false;
  palestrantesPesq = null;
  id = null;
  imageTest;
  locais;
  progs;
  @ViewChild('myInput2') myInput: ElementRef;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              formBuilder: FormBuilder,
              private firebaseProvider: FirebaseProvider,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private actionSheetCtrl: ActionSheetController,
              private camera: Camera,
              private menuCtrl: MenuController,
              private toastCtrl: ToastController,
              private viewCtrl: ViewController) {
  firebaseProvider.getLocais().then(locais=>{
    this.locais =  locais;
    console.log("locais: ", this.locais);
    firebaseProvider.getProgs().then(progs=>{
      this.progs = progs;
      this.getId();
      console.log("progs: ", this.progs);
    });
  });
  this.signupForm = formBuilder.group({
    desc: ["",
          Validators.compose([Validators.maxLength(580), Validators.required])
        ],
    local: ["",
          Validators.compose([Validators.minLength(1), Validators.required])
        ],
    dia: ["",
        Validators.compose([Validators.minLength(1), Validators.required])
        ],
    horaI: ["",
        Validators.compose([Validators.minLength(1), Validators.required])
      ],
    horaF: ["",
      Validators.compose([Validators.minLength(1), Validators.required])
    ],
    tipo: ["",
          Validators.compose([Validators.minLength(1), Validators.required])
        ],
    titulo: ["",
              Validators.compose([Validators.minLength(1), Validators.required])
            ]
  });
  }

  resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }

  getId(){
    this.id = this.navParams.get("id");
    this.progOn();
  }

  palestrantesOn(){
    console.log("palestrantesOn:");
      console.log("palestrantes: ",this.palestrantes);
        this.firebaseProvider.list("palestrantes/").then(palestrantes=>{
          console.log("palestrantes: ",palestrantes);
          this.palestrantesPerfil = palestrantes;
        });
  }

  progOn(){
    if (this.id != null) {
      this.firebaseProvider.refOn("prog/"+this.id).on("value",prog=>{
        console.log("progon: ",prog.val());
        this.prog = prog.val();
        if(prog.val().palestrantes){
          console.log("palestrantes: ",prog.val().palestrantes);
          for (let i = 0; i < this.prog.palestrantes.length; i++) {
            this.firebaseProvider.refOn("palestrantes/"+this.prog.palestrantes[i]).once("value",palest=>{
              if(palest.val()){
                this.palestrantes.push(palest.val());
              }
            });
          }
          this.palestrantes2 = this.prog.palestrantes;
        }
        let horas =  prog.val().horario.split("-");
        let horaI = horas[0];
        let horaF = horas[1];
        this.prog.horaI = horaI;
        this.prog.horaF = horaF;
        let dia = this.prog.dia.split("-");
        this.prog.dia = dia[2]+"-"+dia[1]+"-"+dia[0];
        if(prog.val().imagem != undefined){this.imageURL = prog.val().imagem;}
        if(prog.val().imagemUid != undefined){this.imageuid = prog.val().imagemUid;}else{
          this.imageuid = this.generateUUID();
          this.imageTest = this.imageURL;
        }
        this.palestrantesOn();
      });
    }else{
      this.getId();
    }
  }

  atualizaArquivo(event){
    this.arquivo = event.srcElement.files[0];
    console.log("event: ",event);
    console.log("event.srcElement: ",event.srcElement.webkitRelativePath);
    this.enviarArquivo();
  }

  getUsers(ev: any) {

    console.log('palestrantesPerfil/gusuarios', this.palestrantesPerfil);
    this.palestrantesPesq = this.palestrantesPerfil; 
    const val = ev.target.value; 
    if(val && val.trim() != ''){ 
      this.palestrantesPesq = this.palestrantesPesq.filter((usuario) => {
        return (usuario.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }else{
      this.palestrantesPesq = null;
    }
  }

  AddPart(palestrante){
      if(this.palestrantes.length != 0){
        for (let i = 0; i < this.palestrantes.length; i++) {
          console.log("participante.id / this.participantes[i].id: ",palestrante.id ,"/", this.palestrantes[i].id);
          if(palestrante.id == this.palestrantes[i].id){
            let toast = this.toastCtrl.create({
              message:"Usuário já adicionado",
              duration:2000
            });
            toast.present();
            break;
          }
          if(i == this.palestrantes.length-1){
            console.log("participante "+palestrante.id+" adicionadao: ");
            let id = palestrante.id;
            id = ""+id+"";
            this.palestrantes2.push(id);
            console.log("palestrantes2: ",this.palestrantes2);
            this.palestrantes.push(palestrante);
            this.palestrantesPesq = [];
            this.modo();
            break;
          }
        }
      }else{
        let id = palestrante.id;
        id = ""+id+"";
        this.palestrantes2.push(id);
        console.log("palestrantes2: ",this.palestrantes2);
        this.palestrantes.push(palestrante);
        this.palestrantesPesq = [];
        this.modo();
      }
  }

  rmParticipante(part){
      for(let i = 0; i < this.palestrantes.length; i++){
        if(part == this.palestrantes[i]){
          this.palestrantes.splice(i,1);
          for (let j = 0; j < this.palestrantes2.length; j++) {
              if (this.palestrantes2[j] == part.id) {
                this.palestrantes2.splice(j,1);
              }
          }
          console.log("Item palestrantes2: ", this.palestrantes2);
          console.log("Item removido: ", this.palestrantes);
          console.log("Item removido: ", this.palestrantes);
          console.log("Item removido/sub: ", part);
          break;
        }
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
      let upload = this.firebaseProvider.imagemUpload("programações/").child(name+".jpg").put(this.arquivo,metadata);
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

  ionViewDidLeave(){
    console.log('refOff palestrantes/+this.id');
    this.firebaseProvider.refOff("palestrantes/"+this.id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddProgPage');
  }

  sideMenu(){
    this.menuCtrl.open();
  }

  modo(){
    this.addPalest = !this.addPalest;
  }

  Trim(vlr) {
    while(vlr.indexOf(" ") != -1){
      vlr = vlr.replace(" ", "");
    }
    return vlr;
  }

  addProg(){
    console.log("singupForm: ",this.signupForm.value);
    if (this.signupForm.valid && this.palestrantes.length > 0 && ((this.signupForm.value.tipo == "Maratona" && this.imageURL != "assets/images/circulo.png") || this.signupForm.value.tipo != "Maratona") ){
      let loading = this.loadingCtrl.create({
        spinner: 'ios',
        duration: 30000
      });
      loading.present();
      let ok = false;
      let dia = this.signupForm.value.dia;
      dia = dia.split("-");
      let hora = this.signupForm.value.horaI;
      hora = hora.split(":");
      let fila = dia[2]+""+dia[1]+""+dia[0]+""+ hora[0]+""+hora[1];
      dia = dia[2]+"-"+dia[1]+"-"+dia[0];
      let horario = this.signupForm.value.horaI + "-" + this.signupForm.value.horaF;
      this.signupForm.value.dia = dia;
      this.signupForm.value.fila = fila;
      this.signupForm.value.horario = horario;
      this.signupForm.value.palestrantes = this.palestrantes2;
      this.signupForm.value.horaI = null;
      this.signupForm.value.horaF = null;
      this.signupForm.value.local = this.Trim(this.signupForm.value.local);
      if(this.signupForm.value.tipo == "Maratona"){
        this.signupForm.value.imagem = this.imageURL;
        this.signupForm.value.imagemUid = this.imageuid;
      }
      this.signupForm.value.tipo = this.signupForm.value.tipo.toLowerCase();
    console.log("singupForm: ",this.signupForm.value);
    console.log("prog: ",this.prog);
    let id = this.generateUUID();
    this.signupForm.value.id = this.prog.id;
    console.log("signupForm.value: ",this.signupForm.value); 
      this.firebaseProvider.update("prog/"+this.signupForm.value.id,this.signupForm.value).then(()=>{
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
          title:"Programação editada com sucesso!"
        });
        alert.present();
        }
      });
      
    }else{
      if(this.signupForm.value.tipo == "maratona" && this.imageURL == "assets/images/circulo.png"){
        let alert = this.alertCtrl.create({
          title:"É obrigatório imagem no cadastro de maratonas."
        });
        alert.present();
      }else{
        if (this.palestrantes.length == 0){
          let alert = this.alertCtrl.create({
            title:"É obrigatório adiconar palestrantes nos eventos."
          });
          alert.present();
        }else{
          let alert = this.alertCtrl.create({
            title:"Preencha os campos corretamente."
          });
          alert.present();
        }
      }
    }
  }
  
  voltar(){
    this.viewCtrl.dismiss();
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
}
