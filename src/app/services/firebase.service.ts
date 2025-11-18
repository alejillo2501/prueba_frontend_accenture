import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private rc = getRemoteConfig(initializeApp(environment.firebaseConfig));

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
