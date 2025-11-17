import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';

const firebaseConfig = {
  apiKey: "AIzaSyAKPjL6S0GmQLtVMSuvwNfTINfplBHn-qQ",
  authDomain: "ionic-todo-gemini.firebaseapp.com",
  projectId: "ionic-todo-gemini",
  storageBucket: "ionic-todo-gemini.firebasestorage.app",
  messagingSenderId: "884967654752",
  appId: "1:884967654752:web:8a5be8de1edce706d3ca05"
};

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private rc = getRemoteConfig(initializeApp(firebaseConfig));

  constructor() {
    this.rc.settings.minimumFetchIntervalMillis = 30000;
  }

  async load() {    
    try {
      await fetchAndActivate(this.rc);
      console.log('Remote Config activado');
    } catch (err) {
      console.warn('Remote Config: no se pudo fetchAndActivate', err);
    }
  }

  get enableChatbot(): boolean {
    return getValue(this.rc, 'enable_chatbot').asBoolean();
  }
  
}
