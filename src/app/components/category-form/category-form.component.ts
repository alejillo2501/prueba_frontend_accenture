import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonInput, IonSelect, IonSelectOption, IonButton, IonItem, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { addCircle } from 'ionicons/icons';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonInput, 
    IonSelect, 
    IonSelectOption, 
    IonButton, 
    IonItem, 
    IonIcon
  ],
})
export class CategoryFormComponent {

  @Output() add = new EventEmitter<{ name: string; color: string }>();
  name = '';
  color = 'primary';

  constructor() {
      addIcons({ addCircle });
    }

  submit() {
    if (!this.name.trim()) return;
    this.add.emit({ name: this.name, color: this.color });
    this.name = '';
  }
}
