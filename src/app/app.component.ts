import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { HomePage } from '../pages/home/home';


import { FIREBASE_CREDENTIALS } from './firebase-cred';
import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any, icone: any}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar) {
    this.initializeApp();
    firebase.initializeApp(FIREBASE_CREDENTIALS);
    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icone:"home" },
      { title: 'Programação Geral', component: 'page-progs-geral', icone:"calendar" },
      { title: 'Maratonas', component: 'page-progs-maratonas', icone:"md-trophy" },
      { title: 'Palestrantes', component: 'palestrantes', icone:"md-contacts" },
      { title: 'Adicionar palestrante', component: 'page-add-palestrante', icone:"md-person-add" },
      { title: 'Adicionar programação', component: 'page-add-prog', icone:"md-add-circle" }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
    });
  }

  redeSocial(RS){
    window.open(RS, '_system', 'location=no');
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
