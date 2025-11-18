import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const CAT_KEY = 'categories';

export interface Category {
  id: string;
  name: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private cats: Category[] = [];

  async load() {
    const { value } = await Preferences.get({ key: CAT_KEY });
    this.cats = value ? JSON.parse(value) : [{ id: '1', name: 'General', color: 'primary' }];
  }

  async save() {
    await Preferences.set({ key: CAT_KEY, value: JSON.stringify(this.cats) });
  }

  getAll() { return this.cats; }

  add(name: string, color: string) {
    this.cats.push({ id: Date.now().toString(), name, color });
    this.save();
  }

  delete(id: string) {
    this.cats = this.cats.filter(x => x.id !== id);
    this.save();
  }

  update(id: string, name: string) {
    const cat = this.cats.find(x => x.id === id);
    if (cat) {
      cat.name = name;
      this.save();
    }
  }
  
}
