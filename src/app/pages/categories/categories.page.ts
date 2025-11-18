import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { Category, CategoryService } from '../../services/category.service';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CategoryFormComponent]
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];

  constructor(
    public cat: CategoryService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    // Cargar las categorías cuando la página se inicie
    this.loadCategories();
  }

  ionViewWillEnter() {
    // Recargar las categorías cada vez que se entre en la página
    // para ver los nuevos elementos añadidos.
    this.loadCategories();
  }

  loadCategories() {
    this.categories = this.cat.getAll();
  }

  addCategory(event: { name: string, color: string }) {
    this.cat.add(event.name, event.color);
    this.loadCategories(); // Recargar la lista para mostrar la nueva categoría
  }

  async confirmDelete(categoryId: string, event: MouseEvent) {
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar esta categoría? Se eliminarán también todas las tareas asociadas.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.cat.delete(categoryId);
            this.loadCategories();
          },
        },
      ],
    });
    await alert.present();
  }
}