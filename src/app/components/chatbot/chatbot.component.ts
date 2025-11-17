import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, IonLabel, IonInput, IonSpinner } from '@ionic/angular/standalone';
import { Category } from 'src/app/services/category.service';
import { GeminiService } from 'src/app/services/gemini.service';
import { TodoService } from 'src/app/services/todo.service';
import { addIcons } from 'ionicons'; 
import { chatbubbles, send, close, mic } from 'ionicons/icons';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, IonLabel, IonInput, IonSpinner,    
  ],
})
export class ChatbotComponent {

  @Input() categories: Category[] = [];
  open = false;
  input:string = '';
  loading = false;
  isListening = false;
  messages: string[] = [
    'Bot: ¡Hola! Soy tu asistente. Pídeme que agregue una tarea, por ejemplo: "comprar pan para la categoría compras".'
  ];

  constructor(
    private gemini: GeminiService, 
    private todo: TodoService,
    private platform: Platform
  ) {
    addIcons({ chatbubbles, send, close, mic });
  }

  openModal() {
    this.open = true;
  }

  async send() {
    if (!this.input.trim() || this.loading) return;
    const question:string = this.input;
    this.messages.push('Tú: ' + question);
    this.input = '';
    this.loading = true;

    try {
      const res = await this.gemini.extractTask(question);
      console.log('Gemini response:', res);
      if (res) {
        const cat = this.categories.find(c => c.name.toLowerCase() === res.category.toLowerCase());
        this.todo.add(res.title, cat?.id || '1');
        this.messages.push('Bot: ✅ Tarea agregada: ' + res.title);
      } else {
        this.messages.push('Bot: ❌ No pude entender la tarea');
      }
    } catch (e:any) {
      this.messages.push('Bot: ❌ Error: ' + e.message);
    } finally {
      this.loading = false;
    }
  }

  async listen() {
    if (this.isListening) return;

    // Solo usar el plugin en plataformas nativas (iOS/Android)
    if (!this.platform.is('hybrid')) {
      this.messages.push('Bot: ❌ El reconocimiento de voz nativo solo funciona en la app móvil.');
      return;
    }

    // 1. Solicitar permiso al usuario
    const permission = await SpeechRecognition.checkPermissions();
    if (permission.speechRecognition !== 'granted') {
      await SpeechRecognition.requestPermissions();
    }

    try {
      this.isListening = true;
      // 2. Empezar a escuchar
      const result = await SpeechRecognition.start({
        language: 'es-ES',
        popup: true, // Asegura que el diálogo emergente se muestre en Android
        prompt: 'Dime la tarea...', // Mensaje que se muestra en el diálogo nativo
        partialResults: false,
      });

      if (result && result.matches && result.matches.length > 0) {
        this.input = result.matches[0];
        await this.send();
      }
    } catch (error) {
      console.error('Error en reconocimiento de voz:', error);
      this.messages.push('Bot: ❌ Hubo un error al usar el micrófono.');
    } finally {
      this.isListening = false;
    }
  }
}
