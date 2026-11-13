import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { ColorPickerDirective } from 'ngx-color-picker';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../services/category/category.service';
import { CategoryCreateDTO, CategoryResponseDTO } from '../../DTOs/category-dtos';
import { finalize } from 'rxjs';

export interface Category {
  isEditing: boolean;
  object: CategoryResponseDTO;
  tempName?: string;
  tempColor?: string
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
  categories: Category[] = [];
  newCategoryName: string = '';
  newCategoryColor: string = '#FFFFFF';
  isAddingCategory: boolean = false;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(
      (response) => {
        this.categories = response.map((category) => ({
          isEditing: false,
          object: category
        }));
      }
    );
  }

  startEditing(category: any): void {
    category.isEditing = true;
    category.tempName = category.object.name;
    category.tempColor = category.object.color;
  }

  saveCategoryName(category: any): void {
    if (!category.isEditing) return;

    if (
      category.tempName && category.tempName.trim() !== '' &&
      (category.tempName !== category.object.name || category.tempColor !== category.object.color)
    ) {
      category.object.name = category.tempName.trim();
      this.categoryService.updateCategory(category.object.id, { name: category.object.name, color: category.object.color }).subscribe({
        next: (updatedCategory) => {
          category.object = updatedCategory;
        },
        error: (error) => {
          console.error('Error updating category:', error);
          category.tempName = category.object.name;
        }
      });
    } else {
      category.tempName = category.object.name;
      category.tempColor = category.object.color;
    }

    category.isEditing = false;
  }

  cancelEditing(category: any): void {
    category.tempName = category.object.name;
    category.isEditing = false;
  }

  addCategory(): void {
    if (this.newCategoryName.trim() !== '') {
      const newCategory: CategoryCreateDTO = {
        name: this.newCategoryName.trim(),
        color: this.newCategoryColor
      };

      this.categoryService.createCategory(newCategory).pipe(
        finalize(() => this.cancelAddingCategory())
      ).subscribe({
        next: (createdCategory) => {
          this.categories.push({
            isEditing: false,
            object: createdCategory
          });
        },
        error: (error) => {
          console.error('Error creating category:', error);
        }
      });
    }
  }

  cancelAddingCategory(): void {
    this.isAddingCategory = false;
    this.newCategoryName = '';
    this.newCategoryColor = '#FFFFFF';
  }

  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(category => category.object.id !== id)
      },
      error: () => {
        console.log("A error ocurred while deleting the category")
      }
    })
  }
}
