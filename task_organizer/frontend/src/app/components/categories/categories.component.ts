import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { ColorPickerDirective } from 'ngx-color-picker';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

export interface Category {
  isEditing: boolean;
  object: {
    name: string;
    color: string;
  }
  tempName?: string;
  taskCount: number;
}

@Component({
  selector: 'app-categories',
  imports: [
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    ColorPickerDirective,
    MatInputModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  categories: Category[] = [
    {
      isEditing: false, object: { name: 'Work', color: '#FF5733' },
      taskCount: 5
    },
    {
      isEditing: false, object: { name: 'Personal', color: '#33FF57' },
      taskCount: 0
    },
    {
      isEditing: false, object: { name: 'Shopping', color: '#5733FF' },
      taskCount: 3
    },
    {
      isEditing: false, object: { name: 'Fitness', color: '#FF33A1' },
      taskCount: 2
    },
    {
      isEditing: false, object: { name: 'Travel', color: '#33FFF6' },
      taskCount: 0
    }
  ];
  newCategoryName: string = '';
  isAddingCategory: boolean = false;

  startEditing(category: any): void {
    category.isEditing = true;
    category.tempName = category.object.name;
  }

  saveCategoryName(category: any): void {
    if (!category.isEditing) return;

    if (category.tempName && category.tempName.trim() !== '') {
      category.object.name = category.tempName.trim();
      // TODO: Chamar seu serviço para persistir no backend se necessário
      // this.categoryService.update(category).subscribe();
    } else {
      category.tempName = category.object.name;
    }

    category.isEditing = false;
  }

  cancelEditing(category: any): void {
    category.tempName = category.object.name;
    category.isEditing = false;
  }

  addCategory(): void {}

  cancelAddingCategory(): void {
    this.isAddingCategory = false;
    this.newCategoryName = '';
  }
}
