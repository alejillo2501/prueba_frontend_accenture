import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonInput, IonSelect, IonSelectOption, IonButton, IonItem, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Category } from '../../services/category.service';
import { addIcons } from 'ionicons';
import { addCircle } from 'ionicons/icons';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
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
export class TaskFormComponent {

  @Input() categories: Category[] = [];
  @Output() add = new EventEmitter<{ title: string; categoryId: string }>();

  title = '';
  categoryId = '';

  constructor() {
    addIcons({ addCircle });
  }

  submit() {
    if (!this.title.trim() || !this.categoryId) return;
    this.add.emit({ title: this.title, categoryId: this.categoryId });
    this.title = '';
  }
}
