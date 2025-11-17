import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bookmarks, chatbubbles, home } from 'ionicons/icons';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class BadgeComponent {
  @Input() chatbot!: ChatbotComponent;
  @Input() enableChatbot = false;

  constructor() {
    addIcons({ home, bookmarks, chatbubbles });
  }

  openChatbot(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.chatbot.openModal();
  }
}