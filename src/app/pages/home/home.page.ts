import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
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
    public firebase: FirebaseService
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
}
