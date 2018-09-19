import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  constructor() {
    console.log('Hello FirebaseProvider Provider');
  }

  list(path){ 
    return new Promise((resolve, reject)=>{
			let list = [];
			firebase.database().ref(path).once("value",userProfileSnapshot=>{
				let result = userProfileSnapshot;
				result.forEach(element => {
					list.push(element.val());
        });
        //console.log("result/list: ",list);
				resolve(list);
			},error=>{
        console.log("Erro/list: ",error);
				resolve("Erro");
			});
		  });
  }
  refOn(path){
    return firebase.database().ref(path);
  }
  refOnMaratonas(path){
    return firebase.database().ref(path).orderByChild('tipo').equalTo('maratona');
  }
  refOff(path){
    return firebase.database().ref(path).off();
  }
  update(path,data){
    return firebase.database().ref(path).update(data);
  }
  set(path,valor){
    return firebase.database().ref(path).set(valor);
  }
  push(path,valor){
    return firebase.database().ref(path).push(valor);
  }
  delete(path){ 
    return firebase.database().ref(path).remove();
  }
  TransformList(result){
    return new Promise((resolve, reject)=>{
			  let list = [];
				result.forEach(element => {
					list.push(element.val());
        });
        //console.log("result/TransformList: ",list);
				resolve(list);
		});
  }
  Hora(){
		let horas:any = new Date().getHours();
		let minutos:any = new Date().getMinutes();
		
			if(horas < 10){
				horas = "0" + horas;
			}
			if(minutos < 10){
				minutos = "0" + minutos;
			}
		
    let dataNow:any = horas + "" + minutos;
    dataNow = parseInt(dataNow);
		return dataNow;
  }

  HoraL(){
		let horas:any = new Date().getHours();
		let minutos:any = new Date().getMinutes();
    horas + 1;
			if(horas < 10){
				horas = "0" + horas;
			}
			if(minutos < 10){
				minutos = "0" + minutos;
			}
		
    let dataNow:any = horas + "" + minutos;
    dataNow = parseInt(dataNow);
		return dataNow;
  }

  Dia(){
		let ano:any = new Date().getFullYear();
		let mes:any = new Date().getMonth() + 1;
		let dia:any = new Date().getDate();
		
			if(mes < 10){
				mes = "0" + mes;
			}
			if(dia < 10){
				dia = "0" + dia;
			}
		
		let dataNow:any = dia +"-"+ mes +"-"+ ano;
		return dataNow;
  }
  
  uploadFotoPerfil(imageuid,myPhoto){ 
    let fotoPerfilRef = firebase.storage().ref('image/');
    return new Promise((resolve, reject)=>{
      let uploadTask = fotoPerfilRef.child(imageuid).child('perfil.jpeg')
      .putString(myPhoto, 'base64', { contentType: 'image/jpeg' });
      uploadTask.on('state_changed',(savedPicture:any) => {
        let progress:any = (savedPicture.bytesTransferred / savedPicture.totalBytes) * 100;
        progress = parseInt(progress);
        console.log('Upload is ' + progress + '% done');
      }, error => {
        resolve({status:"Erro"});
			},()=>{
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
          console.log('File available at', downloadURL);
          resolve({status:"OK",body:downloadURL})
        });
      });
    });
  }

  delImage(image):Promise<any>{
		return firebase.storage().refFromURL(image).delete().then(function() {
		}).catch(function(error){});
	}

}
