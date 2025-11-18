import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'tasks';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  
  private tasks: Task[] = [];

  async load() {
    const { value } = await Preferences.get({ key: STORAGE_KEY });
    this.tasks = value ? JSON.parse(value) : [];
  }

  async save() {
    await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(this.tasks) });
  } 

  getAll() {
    return this.tasks;
  }

  add(title: string, categoryId: string) {
    this.tasks.push({ id: Date.now().toString(), title, completed: false, categoryId });
    this.save();
  }

  toggle(id: string) {
    const t = this.tasks.find(x => x.id === id);
    if (t) { t.completed = !t.completed; this.save(); }
  }

  delete(id: string) {
    this.tasks = this.tasks.filter(x => x.id !== id);
    this.save();
  }

  update(id: string, title: string) {
    const task = this.tasks.find(x => x.id === id);
    if (task) {
      task.title = title;
      this.save();
    }
  }
}
