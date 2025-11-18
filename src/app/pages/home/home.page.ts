import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { ChatbotComponent } from '../../components/chatbot/chatbot.component';
import { from, Observable, of } from 'rxjs';
import { Category, CategoryService } from '../../services/category.service';
import { Task, TodoService } from '../../services/todo.service';
import { FirebaseService } from '../../services/firebase.service';
import { addIcons } from 'ionicons';
import { pricetagsOutline, trash } from 'ionicons/icons';
import { BadgeComponent } from 'src/app/components/badge/badge.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule, 
    TaskFormComponent, 
    ChatbotComponent, 
    BadgeComponent
  ],
})
export class HomePage implements OnInit {
  @ViewChild(ChatbotComponent) chatbot!: ChatbotComponent;
  tasks$: Observable<Task[]> = of([]);
  categories: Category[] = [];
  selectedCat = '';
  showCompleted = true;
  enableChatbot = false; // Por defecto desactivado, se activará desde Firebase.

  constructor(
    public todo: TodoService,
    public cat: CategoryService,
    public firebase: FirebaseService,
    private alertCtrl: AlertController
  ) {
    addIcons({ pricetagsOutline, trash });
  }

  async ngOnInit() {
    await this.firebase.load();
    this.enableChatbot = this.firebase.enableChatbot || false;
    await this.todo.load();
    await this.cat.load();
    this.categories = this.cat.getAll();
    this.tasks$ = from([this.todo.getAll()]);
  }

  trackTask(index: number, task: Task): string {
    return task.id; // Identificador único para Angular
  }

  get incompleteTasks(): Task[] {
    return this.todo.getAll().filter(t =>
      !t.completed && (this.selectedCat ? t.categoryId === this.selectedCat : true)
    );
  }

  get completedTasks(): Task[] {
    return this.todo.getAll().filter(t =>
      t.completed && (this.selectedCat ? t.categoryId === this.selectedCat : true)
    );
  }

  getCategoryName(categoryId: string): string {
  const category = this.categories.find(c => c.id === categoryId);
  return category?.name || 'Sin categoría';
}

  getCategoryColor(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    const colorName = category?.color?.toLowerCase();

    switch (colorName) {
      case 'primary':
        return '#3880ff';
      case 'secondary':
        return '#3dc2ff';
      case 'tertiary':
        return '#5260ff';
      case 'success':
        return '#2dd36f';
      case 'warning':
        return '#ffc409';
      case 'danger':
        return '#eb445a';
      default:
        return '#808080'; // Gris por defecto si no hay color o no coincide
    }
  }

  async confirmDelete(taskId: string, event: MouseEvent) {
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar esta tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => this.todo.delete(taskId),
        },
      ],
    });
    await alert.present();
  }
}
